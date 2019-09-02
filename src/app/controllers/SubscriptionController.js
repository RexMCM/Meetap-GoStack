import { isBefore, startOfHour, parseISO } from 'date-fns';
import Subscription from '../models/Subscription';
import User from '../models/User';
import Meetup from '../models/Meetup';

class SubscriptionController {
  async store(req, res) {
    const { meetup_id } = req.body;
    const { id } = await User.findByPk(req.userId);
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

    return res.json(newSubscription);
  }
}

export default new SubscriptionController();
