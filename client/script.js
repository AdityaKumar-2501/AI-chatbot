import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300)
}

function typetext(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        }
        else {
            clearInterval(interval);
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
            <div class="wrapper ${isAi && 'ai'}">
                <div class="chat">
                    <div class="profile">
                        <img 
                            src="${isAi ? bot : user}"
                            alt = "${isAi ? 'bot' : 'user'}"
                        />
                    </div>
                    <div class="message" id=${uniqueId}>${value}</div>
                </div>
            </div>
        `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    //user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    //bot's chatstripe
    
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    //fetch data from server and this is bot's response

    const response = await fetch('https://chat-ai-2uos.onrender.com', {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok){
        // const data  = await response.json();
        // const parsedData = data.bot.trim();

        // typetext(messageDiv,parsedData);

        try {
            const data = await response.json();
            console.log(data);
            // Check if 'bot' property exists in the response and is not null/undefined
            if ('bot' in data && data.bot !== null) {
                const parsedData = data.bot.trim();
                typetext(messageDiv, parsedData);
            } else {
                throw new Error("Invalid response format: 'bot' property missing or null/undefined.");
            }
        } catch (error) {
            messageDiv.innerHTML = "Something went wrong";
            console.error(error);
        }
    }
    else {
        const err = await response.text();
        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {  // submit form by enter
        handleSubmit(e);
    }
});