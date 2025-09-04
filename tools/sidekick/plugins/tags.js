/**
 * Tags Plugin for Sidekick Library
 * Displays current page tags and allows tag management
 */

import { PLUGIN_EVENTS } from 'https://www.aem.live/tools/sidekick/library/events/events.js';

export default {
  title: 'Tags',
  searchEnabled: true,
};

/**
 * Called when a user tries to load the plugin
 * @param {HTMLElement} container The container to render the plugin in
 * @param {Object} data The data contained in the plugin sheet
 * @param {String} query If search is active, the current search query
 * @param {Object} context contains any properties set when the plugin was registered
 */
export async function decorate(container, data, query, context) {
  // Show loader
  container.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.SHOW_LOADER));

  try {
    // Create plugin content
    const pluginContent = document.createElement('div');
    pluginContent.innerHTML = `
      <div style="padding: 20px;">
        <h2>Page Tags</h2>
        <div id="tags-container">
          <p>Loading tags...</p>
        </div>
        <div style="margin-top: 20px;">
          <h3>Add New Tag</h3>
          <input type="text" id="new-tag-input" placeholder="Enter tag name" style="width: 100%; padding: 8px; margin-bottom: 10px;">
          <button id="add-tag-btn" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Add Tag
          </button>
        </div>
      </div>
    `;

    container.appendChild(pluginContent);

    // Simulate loading tags
    setTimeout(() => {
      const tagsContainer = container.querySelector('#tags-container');
      tagsContainer.innerHTML = `
        <div style="margin-bottom: 10px;">
          <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">
            marketing
            <button onclick="this.parentElement.remove()" style="background: none; border: none; margin-left: 8px; cursor: pointer;">×</button>
          </span>
          <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">
            homepage
            <button onclick="this.parentElement.remove()" style="background: none; border: none; margin-left: 8px; cursor: pointer;">×</button>
          </span>
          <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; margin-right: 8px; margin-bottom: 8px; display: inline-block;">
            featured
            <button onclick="this.parentElement.remove()" style="background: none; border: none; margin-left: 8px; cursor: pointer;">×</button>
          </span>
        </div>
      `;
    }, 1000);

    // Add tag functionality
    const addTagBtn = container.querySelector('#add-tag-btn');
    const newTagInput = container.querySelector('#new-tag-input');

    addTagBtn.addEventListener('click', () => {
      const tagName = newTagInput.value.trim();
      if (tagName) {
        const tagsContainer = container.querySelector('#tags-container');
        const newTag = document.createElement('span');
        newTag.style.cssText =
          'background: #e9ecef; padding: 4px 8px; border-radius: 4px; margin-right: 8px; margin-bottom: 8px; display: inline-block;';
        newTag.innerHTML = `
          ${tagName}
          <button onclick="this.parentElement.remove()" style="background: none; border: none; margin-left: 8px; cursor: pointer;">×</button>
        `;
        tagsContainer.appendChild(newTag);
        newTagInput.value = '';

        // Show success toast
        container.dispatchEvent(
          new CustomEvent(PLUGIN_EVENTS.TOAST, {
            detail: {
              message: `Tag "${tagName}" added successfully!`,
              variant: 'positive',
            },
          }),
        );
      }
    });

    // Handle search
    if (query) {
      const tagsContainer = container.querySelector('#tags-container');
      tagsContainer.innerHTML = `<p>Searching for tags containing: "${query}"</p>`;
    }
  } catch (error) {
    console.error('Error in Tags plugin:', error);
    container.dispatchEvent(
      new CustomEvent(PLUGIN_EVENTS.TOAST, {
        detail: { message: 'Error loading tags plugin', variant: 'negative' },
      }),
    );
  } finally {
    // Hide loader
    container.dispatchEvent(new CustomEvent(PLUGIN_EVENTS.HIDE_LOADER));
  }
}
