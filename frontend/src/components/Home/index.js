import React from 'react';
import styles from 'styles/Home.module.scss';
import githubLogo from 'assets/GitHub-Mark-64px.png';
import FeedbackForm from './FeedbackForm';
import { scrollToForm } from 'commonUtils/miscFunctions';


function Home(props) {
	return (
		<div className={styles.home}>
			<div className={styles.underHeader}>
				<FeedbackForm scrollToForm={scrollToForm}/>
			</div>

			<div className={styles.description}>
				<p>
					Are you hungry? Hangry, even? So famished that you can’t even begin to think of what your options could be? Let us be your guide. Enter your location (the more specific, the better) and swipe away until you find something that will satisfy you.
				</p>
			</div>

			<footer>
				<p>What Should I Eat? A website by Sean Carey</p>
				<a 
					href='https://github.com/scarey18' 
					target='_blank' 
					rel="noopener noreferrer"
					title="Sean's GitHub page"
				>
					<img src={githubLogo} alt="GitHub Logo"></img>
				</a>
			</footer>
		</div>
	)
}


export default Home