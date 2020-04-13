import React, { useState } from 'react';
import styles from 'styles/FeedbackForm.module.scss';
import { getCookie } from 'commonUtils/miscFunctions';
import fetch from 'unfetch';


export default function FeedbackForm(props) {
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [senderName, setSenderName] = useState('');
	const [senderEmail, setSenderEmail] = useState('');
	const [text, setText] = useState('');
	const [formErrors, setFormErrors] = useState({});

	const handleSubmit = e => {
		e.preventDefault();
		const errors = checkForErrors();
		if (Object.entries(errors).length > 0) setFormErrors(errors);
		else submitForm();
	}

	const checkForErrors = () => {
		const errors = {};
		if (senderName === '') {
			errors.senderName = '*This field is required.';
		}

		const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		if (senderEmail.length > 0 && !emailRegex.test(senderEmail)) {
			errors.senderEmail = '*Please enter a valid email address.'
		}

		if (text === '') {
			errors.text = '*This field is required.';
		}

		return errors;
	}

	const submitForm = () => {
		const csrftoken = getCookie('csrftoken');

		const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		}

		const body = JSON.stringify({
			'sender_name': senderName,
			'sender_email': senderEmail,
			'text': text,
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
				<p className={styles.formSubmittedMessage}>Thank you for your feedback!</p>}

			{!formSubmitted &&
				<React.Fragment>
					<form onSubmit={handleSubmit}>
						<h1>Contact</h1>
						<p>Have questions, criticisms, or bug reports? We'd love to hear from you!</p>
						<label>	
							Your name:
							{formErrors.senderName &&
								<span className={styles.error}>{formErrors.senderName}</span>}
							<input 
								type="text" value={senderName} name="name"
								onChange={e => setSenderName(e.target.value)}
								placeholder="Jane Doe"
								onFocus={props.scrollToForm}
								maxLength="255"
							/>
						</label>

						<label>
							Your email (optional):
							{formErrors.senderEmail &&
								<span className={styles.error}>{formErrors.senderEmail}</span>}
							<input 
								type="text" value={senderEmail}  name="email"
								onChange={e => setSenderEmail(e.target.value)}
								placeholder="janedoe@email.com"
								onFocus={props.scrollToForm}
							/>
						</label>

						<label>
							Your message:
							{formErrors.text &&
								<span className={styles.error}>{formErrors.text}</span>}
							<textarea 
								type="text" value={text} name="message" 
								onChange={e => setText(e.target.value)}
								placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
								onFocus={props.scrollToForm}
								maxLength="63206"
							/>
						</label>

						<button type="submit">Submit</button>
					</form>
				</React.Fragment>
			}
		</div>
	)	
}