import App from './App.svelte';
import 'robot3/debug';


const app = new App({
	/*#if _DEV 
	target: document.body
	//#else */
	target: document.getElementById("eventsViewer")
	//#endif 
	
});


export default app;