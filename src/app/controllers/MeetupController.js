// import * as Yup from 'yup';
import { isBefore, startOfHour, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async store(req, res) {
    // check for past dates
    const reqDate = startOfHour(parseISO(req.body.date));
    if (isBefore(reqDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }
    const response = await Meetup.create(req.body);
    return res.json(response);
  }

  async update(req, res) {
    const { date, user_id } = req.body;
    const { id } = await User.findByPk(req.userId);

    const reqDate = startOfHour(parseISO(date));
    if (isBefore(reqDate, new Date()) || user_id !== id) {
      return res.status(400).json({
        error: 'You canoot update past date or meetups that not belongs to you',
      });
    }

    const meetup = await Meetup.findByPk(id);
    const response = await meetup.update(req.body);
    return res.json(response);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const { id } = await User.findByPk(req.userId);
    const meetups = await Meetup.findAll({
      where: { user_id: id },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(meetups);
  }

  async delete(req, res) {
    const { user_id } = req.body;
    const { id } = await User.findByPk(req.userId);
    const reqDate = startOfHour(parseISO(req.body.date));
    if (user_id !== id) {
      return res
        .status(401)
        .json({ error: 'Not authorized to perform this action.' });
    }

    if (isBefore(reqDate, new Date())) {
      return res.status(400).json('You can not delete past meetups');
    }

    if (!isBefore(reqDate, new Date()) && user_id === id) {
      const meetup = await Meetup.findByPk(req.body.id);
      await meetup.destroy();
    }
    return res.send();
  }
}

export default new MeetupController();
