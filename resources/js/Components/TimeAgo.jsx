import { differenceInDays, formatDistanceToNowStrict } from 'date-fns';
import React from 'react'

const TimeAgo = ({ timestamp }) => {
    if (!timestamp) return null;

    const date = new Date(timestamp);
    const now = new Date();

    const daysOld = differenceInDays(now, date);

    if (daysOld > 7) {
        return (
            <span className='text-gray-400 text-sm'>
                {format(date, 'MMM d, yyyy')}
            </span>
        )
    }

    let time = formatDistanceToNowStrict(date)

    time = time.replace(' seconds', 's').replace(' second', 's')
        .replace(' minutes', 'm').replace(' minute', 'm')
        .replace(' hours', 'h').replace(' hour', 'h')
        .replace(' days', 'd').replace(' day', 'd');

    return (
        <span className='text-gray-400 text-sm' title={date.toLocaleString()}>
            {time}
        </span>
    )
}

export default TimeAgo
