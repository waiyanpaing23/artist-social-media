import { router, useForm, usePage } from '@inertiajs/react'
import React, { useRef, useState } from 'react'
import { MdClose, MdSend } from 'react-icons/md';
import CommentItem from './CommentItem'; // <--- Import the new component

const CommentSection = ({onClose, postId, initialComments, onCommentCountChange}) => {
    const { auth } = usePage().props;
    const scrollRef = useRef(null);

    const [comments, setComments] = useState(initialComments);
    const [newCommentBody, setNewCommentBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newCommentBody.trim()) return;

        setIsSubmitting(true);
        axios.post('/comments', {
            post_id: postId,
            content: newCommentBody
        })
        .then(response => {
            const newComment = response.data;

            const newCommentsList = [...comments, newComment];
            setComments(newCommentsList);

            if (onCommentCountChange) {
                onCommentCountChange(newCommentsList.length);
            }

            setNewCommentBody('');
            setIsSubmitting(false);

            setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 100);
        })
        .catch(error => {
            console.error("Failed to post comment:", error);
            setIsSubmitting(false);
        });
    }

    const handleCommentDelete = (deletedCommentId) => {
        const newList = comments.filter(c => c.id !== deletedCommentId);
        setComments(newList);
        if (onCommentCountChange) onCommentCountChange(newList.length);
    };

    const handleCommentUpdate = (id, newContent) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === id ? { ...comment, content: newContent } : comment
            )
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg h-[80vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                    <h3 className="font-bold text-gray-800">Comments</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
                        <MdClose size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {comments && comments.length > 0 ? (
                        comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onDeleteSuccess={handleCommentDelete}
                                onUpdateSuccess={handleCommentUpdate} />
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <p>No comments yet!</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                             <img src={`https://ui-avatars.com/api/?name=${auth.user.name}`} alt="Me" />
                        </div>
                        <input
                            type="text"
                            value={newCommentBody}
                            onChange={e => setNewCommentBody(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="p-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition"
                        >
                            Post
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default CommentSection;
