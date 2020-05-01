<script>
	import { isSameDay, format } from 'date-fns'
	import {sp} from "@pnp/sp";
	import {config} from './config';
	import Logger from 'js-logger';
	import {onMount} from 'svelte';
	import {getData} from './getData';
	import { createMachine, assign } from "xstate";
  	import { useMachine } from "xstate-svelte";
	
	Logger.useDefaults(); 
	
	const today = new Date();
	let listNames = Object.keys(config.lists); 
	
const simpleMachine = Machine({
	id: 'events',
	initial: 'idle',
	context: {
		data: [], 
		config: config, 
		tabs: config.lists, 
	},
	states: {
		idle: { 
			on: { MOUNT: 'getData' }
		},
		getData: { 
			invoke: {
				id: 'fetch',
				src: (context, event) => getData(context.config),
				onDone: {
					target: 'resolve', 
					actions: assign({
						data: event.data
					})
				 },
			}
		},
		resolve: {
			entry: 'displayDefaultTab', 
			target: 'initialized',

		},
		initialized: {
			on: { 
				CLICKED: { 
					actions: assign({
						tabs: (context, event)=>{
							context.tabs.map(value=>{
								let prop = Object.getOwnPropertyNames(value); 
								prop == event.data ? value[prop] = ' activeTab' : '';
								value; 
							})
						}
					})
				}
			}
		}
	},
	actions: {
		displayDefaultTab: (context, event) => document.getElementById('defaultTab').click()
	}
});

	const { state, send } = useMachine(simpleMachine);
	let data = state.context.data;

    (window).global = window;
	if (global === undefined) {
   	var global = window;
}		
	
	
		/*
		onMount(async () => {
	
		data =  getData(config);
		document.getElementById('defaultTab').click();
		
	}); 
	*/
	
	function displayTab(evt, listName) {
		let i, tabcontent, tabButtons;

		Logger.debug(evt);
		 
		Logger.debug(listName); 

		tabcontent = document.getElementsByClassName("tabContent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		tabButtons = document.getElementsByClassName("tabButton");
		for (i = 0; i < tabButtons.length; i++) {
			tabButtons[i].className = tabButtons[i].className.replace(" activeTab", "");
		}

		document.getElementById(listName).style.display = "block";
		evt.currentTarget.className += " activeTab";
	}
</script>

<main>
	<div class='tab'>
		<button class='tabButton {$state.context.tabs.allEvents}' on:click|preventDefault={(event)=>send({type:'CLICKED', data: 'allEvents'})} id='defaultTab'>ALL Events</button>
		{#each (config.lists) as listName}
		<button class='tabButton {$state.context.tabs[listName]}' on:click|preventDefault={(event)=>send({type:'CLICKED', data: listName})}>{listName.replace('BLDG 3317 ', '')}</button>
		{/each}
	</div>
	<div class='tabContent' id='allEvents'>
			{#await data}
			<p>...retreiving data</p>
			{:then data}
			
			<ul>Today's Events
			{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration}, i}
				{#if isSameDay(EventDate, today) }
					<li><a target="_blank" href="{linkUrl}">
						<div class="JocEvent"><span class="time">{format(EventDate,"DDMMM (HH:mm-")}</span><span class="endTime">{format(EndDate,"HH:mm)")} </span> <span class="title">- {Title}</span></div>
					</a></li>
				{/if}
			{/each}
			</ul>
			
			<ul>Upcoming Events
			{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration }}
				
				{#if !(isSameDay(EventDate, today)) }
					<li><a target="_blank" href="{linkUrl}">
						<div class="JocEvent"><span class="time">{format(EventDate, "DDMMM (HH:mm-")}</span><span class="endTime">{format(EndDate,"HH:mm)")} </span> <span class="title">- {Title}</span></div>					
					</a></li>
				{/if}
			{/each}
			</ul>
			{:catch error }
			<p style="color: red">{error.message}</p>
			{/await}
		</div>
	{#each (config.lists) as listName}
		<div class='tabContent' id={listName}>
			{#await data}
			<p>...retreiving data</p>
			{:then data}
			
			<ul>Today's Events
			{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration}, i}
				{#if isSameDay(EventDate, today) && list == listName}
					<li><a target="_blank" href="{linkUrl}">
						<div class="JocEvent"><span class="time">{format(EventDate, "DDMMM (HH:mm-")}</span><span class="endTime">{format(EndDate, "HH:mm)")} </span> <span class="title">- {Title}</span></div>					
					</a></li>
				{/if}
			{/each}
			</ul>
			
			<ul>Upcoming Events
			{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration }}
				
				{#if !(isSameDay(EventDate, today)) && list == listName }
					<li><a target="_blank" href="{linkUrl}">
						<div class="JocEvent"><span class="time">{format(EventDate,"DDMMM (HH:mm-")}</span><span class="endTime">{format(EndDate,"HH:mm)")} </span> <span class="title">- {Title}</span></div>					
					</a></li>
				{/if}
			{/each}
			</ul>
			{:catch error }
			<p style="color: red">{error.message}</p>
			{/await}
		</div>
	{/each}
</main>

<style>
	main {
		text-align: left;
		max-width: 240px;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
	}
	.tab {
		overflow: hidden;
		
	}
	.tab button {
		background-color: inherit;
		float: left;
		border: none;
		outline: none;
		cursor: pointer;
		padding: .5em;
		transition: 0.3s;
		margin: 0px;
		text-transform: uppercase;
		font-size: 15px;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; 
		font-weight: bold;
	}

	.tab button:hover {
	background-color: #ddd;
	}


	.tab .tabButton.activeTab  {
	background-color: #ddd;
	}

	.tabContent {
	display: none;
	padding:.25em;
	
	border-top: none;
	}
	.tabContent {
	animation: fadeEffect 1s; 
	}

	@keyframes fadeEffect {
	from {opacity: 0;}
	to {opacity: 1;}
	}

	.JocEvent{
		color:black;
		font-weight: 200; 
	}
	
	.title{
		font-weight: 400; 
	}
			
	li {
		list-style-type: none;
		font-size: 14px;
		
	}
	ul {
		font-weight: bold;
		font-size: 15px;
		margin-left: -35px;
		color: black;
	}
	a:hover{
		
		text-decoration: none;

	}
	a:hover .JocEvent{
		color: darkblue;

	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>