# AEM Sidekick Library

This directory contains the AEM Sidekick Library configuration and content.

## Structure

```
tools/sidekick/
├── blocks/           # Block variations
│   ├── cards.html    # Cards block variations
│   ├── columns.html  # Columns block variations
│   └── hero.html     # Hero block variations
├── plugins/          # Custom plugins
│   └── tags.js       # Tags management plugin
├── library.csv       # Blocks configuration
├── plugins.csv       # Plugins configuration
└── .metadata         # SEO exclusion settings
```

## Usage

1. **Blocks Plugin**: Provides a visual library of all available blocks for content authors
2. **Tags Plugin**: Allows content authors to manage page tags

## Configuration

### Blocks Configuration (library.csv)
- `name`: Display name for the block
- `path`: Path to the block definition file

### Plugins Configuration (plugins.csv)
- `name`: Display name for the plugin
- `path`: Path to the plugin JavaScript file

## Adding New Blocks

1. Create a new HTML file in `blocks/` directory
2. Add block variations separated by sections
3. Update `library.csv` with the new block entry

## Adding New Plugins

1. Create a new JavaScript file in `plugins/` directory
2. Export a `decorate()` function
3. Update `plugins.csv` with the new plugin entry

## References

- [AEM Sidekick Library Documentation](https://www.aem.live/docs/sidekick-library)
