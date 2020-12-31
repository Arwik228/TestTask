import React from 'react';

export default function Books(props) {
    let items = [];
    for (let i = 0; i < props.array.length; i++) {
        items.push(props.children(props.array[i]));
    }
    return <div>{items}</div>;
}