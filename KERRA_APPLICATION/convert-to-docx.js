import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';

async function convertMdToDocx(mdPath, docxPath) {
    const markdown = fs.readFileSync(mdPath, 'utf-8');
    const lines = markdown.split('\n');

    const children = [];
    let inTable = false;
    let tableRows = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines
        if (line.trim() === '') {
            if (inTable && tableRows.length > 0) {
                try {
                    const table = new Table({
                        rows: tableRows,
                        width: { size: 100, type: WidthType.PERCENTAGE }
                    });
                    children.push(table);
                } catch (e) { }
                tableRows = [];
                inTable = false;
            }
            continue;
        }

        // Handle tables
        if (line.startsWith('|')) {
            inTable = true;
            if (line.includes('---')) continue;

            const cells = line.split('|').filter(c => c.trim() !== '');
            const row = new TableRow({
                children: cells.map(cell => new TableCell({
                    children: [new Paragraph({ children: [new TextRun(cell.trim())] })],
                    width: { size: Math.floor(100 / cells.length), type: WidthType.PERCENTAGE }
                }))
            });
            tableRows.push(row);
            continue;
        } else if (inTable && tableRows.length > 0) {
            try {
                const table = new Table({
                    rows: tableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE }
                });
                children.push(table);
            } catch (e) { }
            tableRows = [];
            inTable = false;
        }

        // Handle headers
        if (line.startsWith('# ')) {
            children.push(new Paragraph({
                text: line.replace('# ', ''),
                heading: HeadingLevel.HEADING_1
            }));
        } else if (line.startsWith('## ')) {
            children.push(new Paragraph({
                text: line.replace('## ', ''),
                heading: HeadingLevel.HEADING_2
            }));
        } else if (line.startsWith('### ')) {
            children.push(new Paragraph({
                text: line.replace('### ', ''),
                heading: HeadingLevel.HEADING_3
            }));
        } else if (line.startsWith('---')) {
            continue;
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            children.push(new Paragraph({
                text: '• ' + line.replace(/^[-*]\s+/, ''),
            }));
        } else if (line.match(/^\d+\.\s/)) {
            children.push(new Paragraph({
                text: line,
            }));
        } else {
            let text = line
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/`(.*?)`/g, '$1')
                .replace(/\[(.*?)\]\(.*?\)/g, '$1')
                .replace(/📍|📧|📱|🔗|💻|✅|⚠️|❌|📋|📌|💰|📊|📈|💡|⏳|🏆|📅/g, '');

            if (text.trim()) {
                children.push(new Paragraph({ text: text }));
            }
        }
    }

    // Handle any remaining table
    if (tableRows.length > 0) {
        try {
            const table = new Table({
                rows: tableRows,
                width: { size: 100, type: WidthType.PERCENTAGE }
            });
            children.push(table);
        } catch (e) { }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(docxPath, buffer);
    console.log(`Created: ${docxPath}`);
}

async function main() {
    const files = [
        ['ICT_OFFICER_II/RESUME.md', 'ICT_OFFICER_II/RESUME.docx'],
        ['ICT_OFFICER_II/COVER_LETTER.md', 'ICT_OFFICER_II/COVER_LETTER.docx'],
        ['ASSISTANT_ICT_OFFICER/RESUME.md', 'ASSISTANT_ICT_OFFICER/RESUME.docx'],
        ['ASSISTANT_ICT_OFFICER/COVER_LETTER.md', 'ASSISTANT_ICT_OFFICER/COVER_LETTER.docx'],
        ['MASTER_CHECKLIST.md', 'MASTER_CHECKLIST.docx']
    ];

    for (const [mdFile, docxFile] of files) {
        try {
            await convertMdToDocx(mdFile, docxFile);
        } catch (err) {
            console.error(`Error converting ${mdFile}:`, err.message);
        }
    }

    console.log('\nDone! All DOCX files created.');
}

main();
