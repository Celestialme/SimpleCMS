<script lang="ts">
	//@ts-ignore
    import { RichTextComposer ,PlainTextPlugin} from 'svelte-lexical/src/index';
		//@ts-ignore
  	import PlaygroundEditorTheme from './PlaygroundEditorTheme';
	  import './global.css';
	 
	
</script>

<RichTextComposer theme={PlaygroundEditorTheme}>
	<PlainTextPlugin></PlainTextPlugin>
</RichTextComposer>