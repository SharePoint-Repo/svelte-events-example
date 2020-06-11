<script>
	import { isSameDay, format, isAfter } from 'date-fns'
	import {sp} from "@pnp/sp";
	import {onMount} from 'svelte';
	import service from './store'; 
		
	const today = new Date();
	const send = $service.send;
	//const lists = $service.context.lists;
	const listNames = $service.context.listNames;
	const replaceText = new RegExp($service.context.config.replaceText); 
	$: data = $service.context.data;
	$: tabStatus = $service.context.tabStatus;
	$: state = $service.machine.current; 

  (window).global = window;

	if (global === undefined) {
		var global = window;
	} 		
	function displayNone(node, id){
		
		let el = document.getElementById(id); 
		el.style.display = 'None'
	}

	onMount(()=>{send('mount');});
</script>

<main>
	<div class='tab'>
		{#each (listNames) as listName}
			<button class='tabButton {tabStatus[listName]}' on:click|preventDefault={(event)=>send({type:'click', data: listName})}>{listName.replace(replaceText, '')}</button>
		{/each}
	</div>
	{#each (listNames) as listName}
	
		<div class='tabContent {tabStatus[listName]}' id={listName}>
			<h3 class='listNameHeader'>{listName}</h3>
			{#await data}
				<p>...retreiving data</p>
			{:then data}
			
				<ul>Today's Events
					<li><div id={listName.replace(/\s/g, '') + "_today_none"}>None</div></li>					
						{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration}, i}
							{#if isSameDay(EventDate, today) && list == listName}
								<li use:displayNone={`${listName.replace(/\s/g, '')}_today_none`}><a target="_blank" href="{linkUrl}">
									<div class="event"><span class="time">{format(EventDate, "ddMMM (HHmm-")}</span><span class="endTime">{format(EndDate, "HHmm)")} </span> <span class="title">- {Title}</span></div>					
								</a></li>
							{:else if isSameDay(EventDate, today) && listName == 'ALL EVENTS'}
							<li use:displayNone={`${listName.replace(/\s/g, '')}_today_none`}><a target="_blank" href="{linkUrl}">
									<div class="event"><span class="time">{format(EventDate, "ddMMM (HHmm-")}</span><span class="endTime">{format(EndDate, "HHmm)")} </span> <span class="title">- {`${list.replace(replaceText, '')} - ${Title}`}</span></div>					
								</a></li>
							{/if}
						{/each}
				</ul>
				
				<ul>Upcoming Events
					<li><div id={listName.replace(/\s/g, '') + "_upcoming_none"}>None</div></li>		
						{#each data as {ID, Title, EventDate, EndDate, list, linkUrl, Duration }}
							{#if (isAfter(EventDate, today)) && list == listName }
								<li use:displayNone={`${listName.replace(/\s/g, '')}_upcoming_none`}>
								<a target="_blank" href="{linkUrl}">
									<div class="event"><span class="time">{format(EventDate,"ddMMM (HHmm-")}</span><span class="endTime">{format(EndDate,"HHmm)")} </span> <span class="title">- {Title}</span></div>					
								</a></li>
							{:else if (isAfter(EventDate, today)) && listName == 'ALL EVENTS'}
								<li use:displayNone={`${listName.replace(/\s/g, '')}_upcoming_none`}><a target="_blank" href="{linkUrl}">
									<div class="event"><span class="time">{format(EventDate, "ddMMM (HHmm-")}</span><span class="endTime">{format(EndDate, "HHmm)")} </span> <span class="title">- {`${list.replace(replaceText, '')} - ${Title}`}</span></div>					
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
		min-width: 430px;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		background: linear-gradient(to left, transparent, silver 80%)
	}
	.tab {
		overflow: hidden;
		
	}
	.tab button {
		background-color: silver;
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
	background-color: black;
	color: white
	}


	.tab .tabButton.activeTab  {
	background: linear-gradient(to bottom, #7892c2, #476e9e);
	color: white;
	}

	.tabContent {
	display: none;
	padding:.25em;
	
	border-top: none;
	}
	.tabContent {
	animation: fadeEffect 1s; 
	}
	.tabContent.activeTab{
		display: block;
	}
	.listNameHeader{
		color: #476e9e;
	}
	@keyframes fadeEffect {
	from {opacity: 0;}
	to {opacity: 1;}
	}

	.event{
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
	a:hover .event{
		color: blue;

	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>