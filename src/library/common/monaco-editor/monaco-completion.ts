export function getCompletionPaths(obj, prefix = '') {
    const paths = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            paths.push(...getCompletionPaths(obj[key], `${prefix}${key}.`));
        } else {
            paths.push(`${prefix}${key}`);
        }
    }
    return paths;
}

export const completionAuditItems = {
    id: 'string',
    datatype: 'string',
    categories: 'array',
    tags: 'array',
    views: 'number',
    likes: 'number',
    dislikes: 'number',
    shares: 'number',
    averageRatings: 'number',
    ratingCount: 'number',
    averageRating: 'number',
    reactions: 'array',
    createdate: 'date',
    modifydate: 'date',
    datefrom: 'date',
    'url-slug': 'string',
    'url-name': 'string',
    'url-sku': 'string',
    'url-id': 'string'
}

export const completionSchema = {
    '[datatype]': completionAuditItems
};
export const completionPaths = getCompletionPaths(completionSchema, 'data.');


const tailwindSheet = [
    {
        title: "Layout",
        content: [
            {
                title: "Aspect Ratio",
                docs: "https://tailwindcss.com/docs/aspect-ratio",
                description: "Utilities for controlling the aspect ratio of an element.",
                table: [
                    ["aspect-auto", "aspect-ratio: auto;"],
                    ["aspect-square", "aspect-ratio: 1 / 1;"],
                    ["aspect-video", "aspect-ratio: 16 / 9;"]
                ]
            },
            {
                title: "Container",
                docs: "https://tailwindcss.com/docs/container",
                description: "Sets the max-width to match the min-width of the current breakpoint.",
                table: [
                    ["container", "width: 100%"],
                    ["sm:container", "max-width: 640px;"],
                    ["md:container", "max-width: 768px;"]
                ]
            }
        ]
    }
];

// const extractTailwindSuggestions = (sheet) => {
//   const suggestions = [];
//   sheet.forEach(section => {
//     section.content.forEach(utility => {
//       utility.table.forEach(([className, css]) => {
//         suggestions.push({
//           label: className,
//           kind: monaco.languages.CompletionItemKind.Keyword,
//           documentation: `${utility.description}\n\nCSS: ${css}\n\n[Learn more](${utility.docs})`,
//           insertText: className
//         });
//       });
//     });
//   });
//   return suggestions;
// };

// const tailwindSuggestions = extractTailwindSuggestions(tailwindSheet);
