// import * as Yup from 'yup';
import {
  isBefore,
  startOfHour,
  parseISO,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async store(req, res) {
    console.log(req.body);
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
    const where = {};
    const page = req.query.page || 1;
    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }
    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
        {
          model: File,
          attributes: ['name', 'path'],
        },
      ],
      attributes: {
        exclude: ['user_id', 'file_id', 'updated_at', 'created_at'],
      },
      limit: 10,
      offset: 10 * (page - 1),
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
