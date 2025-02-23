import { tavily } from '@tavily/core';
import { config } from '../config/config';
import { ResearchState, TopicContent } from '../types/research.state';

export class TavilySearchTool {
    private client;

    constructor() {
        this.client = tavily({ apiKey: config.tavilyApiKey });
    }

    async invoke(state: ResearchState): Promise<Partial<ResearchState>> {
        if (!state.searchPlan) {
            throw new Error('No search plan available in state');
        }

        try {
            console.log('\n🔍 Searching with Tavily...');
            console.log('Search Query:', state.searchPlan);

            // Search using the optimized query
            const searchResponse = await this.client.search(
                state.searchPlan,
                {
                    searchDepth: "advanced",
                    maxResults: config.maxResults,
                    includeAnswer: false
                }
            );

            console.log(`Found ${searchResponse.results.length} results`);

            // Extract content from found URLs
            console.log('Extracting content from URLs...');
            const urls = searchResponse.results.map(r => r.url);
            const extractResponse = await this.client.extract(urls, {
                extractDepth: "basic"
            });

            // Format the response
            const newSources = extractResponse.results.map(r => ({
                url: r.url,
                content: r.rawContent
            }));

            // Accumulate sources with existing ones if they exist
            const existingSources = state.topicContent?.sources || [];
            const allSources = [...existingSources, ...newSources];

            const topicContent: TopicContent = {
                topic: state.searchPlan,
                sources: allSources
            };

            console.log(`Successfully extracted content from ${newSources.length} new sources`);
            console.log(`Total sources accumulated: ${allSources.length}`);
            console.log('✅ Search Complete\n');

            return {
                topicContent
            };
        } catch (error) {
            console.error('Error in Tavily tool:', error);
            throw new Error('Failed to search and extract content');
        }
    }
}