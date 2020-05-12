import App from './App.svelte';
import 'robot3/debug';


const app = new App({
	/*#if !_DEV 
	target: document.getElementById("eventsViewer")
	//#else */
	target: document.body
	//#endif 
	
});


export default app;