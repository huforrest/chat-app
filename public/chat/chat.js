const chat = () => {
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    const ws = new WebSocket('ws://192.168.0.101:3000');

    ws.onopen = () => {
        console.log('连接到服务器');
    };

    ws.onmessage = (event) => {
        const data = event.data;
        const messageElement = document.createElement('div');
        chatBox.appendChild(messageElement);
        if (data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
                const messageStr = reader.result;
                console.log('Received message:', messageStr);
                const message = JSON.parse(messageStr);
                messageElement.textContent = `${message.from}: ${message.content}`;
                chatBox.scrollTop = chatBox.scrollHeight;
            };
            reader.readAsText(data);
        } else {
            console.log('Received message:', data);
            const message = JSON.parse(data);
            messageElement.textContent = `${message.id}: ${message.content}`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    ws.onclose = () => {
        console.log('与服务器断开连接');
    };

    const send = (text) => {
        const userId = JSON.parse(localStorage.getItem('userId'));
        const message = {
            from: userId,
            content: text,
            type: 'text'
        };
        ws.send(JSON.stringify(message));
    }

    sendButton.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (text) {
            console.log("send message: ", text);
            send(text);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
}

fetch('/protected-route', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}).then((response) => {
    const result = response.json();
    console.log(result);
    if (response.ok) {
        chat();
    } else {
        window.location.href = '/login';
    }
});