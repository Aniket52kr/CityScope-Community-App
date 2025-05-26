import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        reply: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply',
        },
    },
    {
        timestamps: true,
    }
);

const Reaction = mongoose.model('Reaction', reactionSchema);
export default Reaction;
