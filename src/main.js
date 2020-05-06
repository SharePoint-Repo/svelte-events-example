import App from './App.svelte';



const app = new App({
	/*#if _DEV
	target: document.body
	//#else */
	target: document.getElementById("eventsViewer")
	//#endif 
	
});



export default app;