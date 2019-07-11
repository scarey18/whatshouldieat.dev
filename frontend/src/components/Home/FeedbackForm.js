import React, { useState } from 'react';
import styles from 'styles/FeedbackForm.module.scss';
import { getCookie } from 'commonUtils/miscFunctions';


export default function FeedbackForm() {
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [senderName, setSenderName] = useState('');
	const [senderEmail, setSenderEmail] = useState('');
	const [text, setText] = useState('');

	const handleSubmit = e => {
		e.preventDefault();

		const csrftoken = getCookie('csrftoken');

		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		}

		const body = JSON.stringify({
			sender_name: senderName,
			sender_email: senderEmail,
			text,
			'csrfmiddlewaretoken': csrftoken,
		});

		fetch('/api/feedback', {
			credentials: 'include',
			method: 'POST',
			mode: 'same-origin',
			headers,
			body,
		});

		setFormSubmitted(true);
	}

	return (
		<div className={styles.formContainer}>
			{formSubmitted &&
				<p>Thank you for your feedback!</p>}

			{!formSubmitted &&
				<form onSubmit={handleSubmit}>
					<label for="sender_name">	
						Your name:
						<input 
							type="text" value={senderName} name="sender_name"
							onChange={e => setSenderName(e.target.value)}
						/>
					</label>

					<label for="sender_email">
						Your email (optional):
						<input 
							type="text" value={senderEmail}  name="sender_email"
							onChange={e => setSenderEmail(e.target.value)}
						/>
					</label>

					<label for="text">
						Your message:
						<textarea 
							type="text" value={text} name="text" 
							onChange={e => setText(e.target.value)}
						/>
					</label>

					<button type="submit">Submit</button>
				</form>
			}
		</div>
	)	
}