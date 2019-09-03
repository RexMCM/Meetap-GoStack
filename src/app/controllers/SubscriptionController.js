import { isBefore, startOfHour, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Mail from '../../lib/Mail';
import Subscription from '../models/Subscription';
import User from '../models/User';
import Meetup from '../models/Meetup';
import File from '../models/File';

class SubscriptionController {
  async index(req, res) {
    const { id } = await User.findByPk(req.userId);

    const meetups = await Subscription.findAll({
      where: { user_id: id },
      include: [
        {
          model: Meetup,
          where: {
            date: { [Op.gt]: new Date() },
          },
          attributes: ['title', 'description', 'location', 'date'],
        },
      ],
      attributes: {
        exclude: ['user_id', 'meetup_id', 'updated_at', 'created_at'],
      },
      order: [[Meetup, 'date']],
    });
    return res.json(meetups);
  }

  async store(req, res) {
    const { meetup_id } = req.body;
    const { id, name } = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(meetup_id, {
      include: [User],
    });
    if (meetup.user_id === id) {
      return res
        .status(400)
        .json({ error: 'You cannot subscribe in your own meetup' });
    }

    const meetupDate = startOfHour(meetup.date);
    if (isBefore(meetupDate, new Date())) {
      return res.status(400).json({
        error: 'You cannot subscribe in a past meetup',
      });
    }

    const checkDuplicateSub = await Subscription.findOne({
      where: { meetup_id, user_id: id },
    });

    if (checkDuplicateSub) {
      return res.status(400).json({
        error: 'You cannot subscribe in the same meetup twice',
      });
    }

    const checkSameDate = await Subscription.findOne({
      where: {
        user_id: id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });
    if (checkSameDate) {
      return res.status(400).json({
        error: "You cannot perfom this action, you're busy at this time",
      });
    }
    const newSubscription = await Subscription.create(req.body);

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: 'New Subscription',
      template: 'alert',
      context: {
        user_id: meetup.User.name,
        user: name,
        meetup: meetup.title,
      },
    });
    return res.json(newSubscription);
  }
}

export default new SubscriptionController();
