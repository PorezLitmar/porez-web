import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const MarkdownRenderer = ({className, md}: { className?: string, md?: string }) => {
    return (
        md ? <div className={className}><ReactMarkdown remarkPlugins={[gfm]}>{md}</ReactMarkdown></div> : <></>
    )
}

export default MarkdownRenderer;
