<script generics="T extends IdLike" lang="ts" strictEvents>
	import { createEventDispatcher } from 'svelte';
	import { flip } from 'svelte/animate';

	import { getTargetHtmlElement } from '$lib/utils/events';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { IdLike } from '~types/generics';

	// eslint-disable-next-line no-undef
	export let list: T[];
	let isOver: string | boolean = false;
	const dispatch = createEventDispatcher<{ sort: typeof list }>();
	const reorder = ({ from, to }: { from: number; to: number }) => {
		const newList = [...list];
		newList[from] = [newList[to], (newList[to] = newList[from])][0];

		dispatch('sort', newList);
	};

	function getDraggedParentDataset(node: HTMLElement | null | undefined) {
		if (!node) {
			return {};
		}
		if (!node?.dataset.index) {
			return getDraggedParentDataset(node?.parentElement);
		}

		return { ...node.dataset };
	}

	function onDragStart(e: DragEvent) {
		const target = getTargetHtmlElement(e);
		const dragged = getDraggedParentDataset(target);
		if (!dragged?.id) {
			console.error('onDragStart Invalid values', dragged?.id);
			return;
		}
		e.dataTransfer?.setData('source', dragged?.index?.toString() ?? '');
	}
	function onDragOver(e: DragEvent) {
		const target = getTargetHtmlElement(e);
		const dragged = getDraggedParentDataset(target);
		isOver = dragged?.id ?? false;
	}
	function onDragLeave(e: DragEvent) {
		const target = getTargetHtmlElement(e);
		const dragged = getDraggedParentDataset(target);
		if (isOver === dragged.id) {
			isOver = false;
		}
	}
	function onDrop(e: DragEvent) {
		const target = getTargetHtmlElement(e);
		isOver = false;
		const dragged = getDraggedParentDataset(target);

		if (!e.dataTransfer?.getData('source') || !dragged.index) {
			console.error('onDrop Invalid values', e.dataTransfer?.getData('source'), dragged.index);
			return;
		}

		reorder({
			from: parseInt(e.dataTransfer.getData('source')),
			to: parseInt(dragged.index)
		});
	}
</script>

{#if list?.length}
	<ul class="list-none p-0 flex flex-col items-center">
		{#each list as item, index (item.id)}
			<li
				class="border-2 border-dashed border-transparent py-2 transition-all max-w-md w-full"
				class:over={item.id === isOver}
				data-id={item.id}
				data-index={index}
				draggable="true"
				on:dragstart={onDragStart}
				on:dragover|preventDefault={onDragOver}
				on:dragleave={onDragLeave}
				on:drop|preventDefault={onDrop}
				animate:flip={{ duration: 300 }}
			>
				<slot {index} {item} />
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-center my-12 text-lg font-bold">No items</p>
{/if}

<style lang="postcss">
	.over {
		@apply border-gray-400 scale-105;
	}
</style>
