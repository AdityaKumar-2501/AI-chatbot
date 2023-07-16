import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = ' ';

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
                <div class="chat>
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

/**
 * The handleSubmit function is an asynchronous function that handles form submission, adds the user's
 * chat stripe to the chat container, resets the form, generates a unique ID for the bot's chat stripe,
 * adds the bot's chat stripe to the chat container, scrolls the chat container to the bottom, and
 * displays a loader for the bot's message.
 * @param e - The parameter "e" is an event object that represents the event that triggered the form
 * submission. In this case, it is used to prevent the default form submission behavior, which would
 * cause the page to refresh.
 */
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

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {  // submit form by enter
        handleSubmit(e);
    }
});