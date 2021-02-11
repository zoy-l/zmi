declare function formatWebpackMessages(json: {
    errors?: any[];
    warnings?: any[];
}): {
    errors: string[];
    warnings: string[];
};
export default formatWebpackMessages;
