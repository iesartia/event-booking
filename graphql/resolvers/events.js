const Event = require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        };
    },
    createEvent: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated');
            }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5c481eb62b9e184f25d41c0c'
            });
    
            let createdEvent;

            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById('5c481eb62b9e184f25d41c0c');

            if (!creator) {
                throw new Error("User does not exists");
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;

        }
        catch (err) {
            throw err;
        };
    }
};