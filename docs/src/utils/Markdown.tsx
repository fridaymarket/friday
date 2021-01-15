import React from 'react'
import 'github-markdown-css'
import emojijs from 'emoji-js'
import MarkdownToJSX from 'markdown-to-jsx'

const emoji = new emojijs.EmojiConvertor();

interface MarkdownProps {
	content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content}) => {

	const ConvertedContent = emoji.replace_colons(content)

	return (
		<div className="markdown-body">
			<MarkdownToJSX>{ConvertedContent}</MarkdownToJSX>
		</div>
	)
}

export default Markdown
