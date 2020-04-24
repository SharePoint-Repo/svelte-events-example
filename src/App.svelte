<script>
	import 'es6-promise';
	import 'whatwg-fetch';
	import moment from 'moment'; 
	import {sp} from "@pnp/sp";
	import {config} from './config';
	import Logger from 'js-logger';
	import {onMount} from 'svelte';
	import {getData} from './getData';
	Logger.useDefaults(); 

    (window).global = window;
	if (global === undefined) {
   	var global = window;
}		
	
	let data = [];
	
	onMount(async () => {
		data =  getData(config);
		document.getElementById('defaultTab').click();
		
	}); 

	
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
		<button class='tabButton activeTab' on:click|preventDefault={(event)=>displayTab(event, 'allEvents')} id='defaultTab'>ALL Events</button>
		{#each (config.lists) as listName}
		<button class='tabButton' on:click|preventDefault={(event)=>displayTab(event, listName)}>{listName.replace('BLDG 3317 ', '')}</button>
		{/each}
	</div>
	<div class='tabContent' id='allEvents'>
			{#await data}
			<p>...retreiving data</p>
			{:then data}
			
			<ul>Today's Events
			{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration}, i}
				{#if moment(EventDate).isSame(moment(), 'day') }
					<li><a target="_blank" href="{linkUrl}">
						<div class="JocEvent"><span class="time">{moment(EventDate).format("DDMMM (HH:mm-")}</span><span class="endTime">{moment(EndDate).format("HH:mm)")} </span> <span class="title">- {Title}</span></div>
					</a></li>
				{/if}
			{/each}
			</ul>
			
			<ul>Upcoming Events
			{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration }}
				
				{#if !(moment(EventDate).isSame(moment(), 'day')) }
					<li><a target="_blank" href="{linkUrl}">
						<div class="JocEvent"><span class="time">{moment(EventDate).format("DDMMM (HH:mm-")}</span><span class="endTime">{moment(EndDate).format("HH:mm)")} </span> <span class="title">- {Title}</span></div>					
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
				{#if moment(EventDate).isSame(moment(), 'day') && list == listName}
					<li><a target="_blank" href="{linkUrl}">
						<div class="JocEvent"><span class="time">{moment(EventDate).format("DDMMM (HH:mm-")}</span><span class="endTime">{moment(EndDate).format("HH:mm)")} </span> <span class="title">- {Title}</span></div>					
					</a></li>
				{/if}
			{/each}
			</ul>
			
			<ul>Upcoming Events
			{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration }}
				
				{#if !(moment(EventDate).isSame(moment(), 'day')) && list == listName }
					<li><a target="_blank" href="{linkUrl}">
						<div class="JocEvent"><span class="time">{moment(EventDate).format("DDMMM (HH:mm-")}</span><span class="endTime">{moment(EndDate).format("HH:mm)")} </span> <span class="title">- {Title}</span></div>					
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