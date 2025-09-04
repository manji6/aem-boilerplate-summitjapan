# AEM Boilerplate Summit Japan

## Development Setup

### Pre-commit Hooks
This project uses pre-commit hooks to ensure code quality. The following checks run automatically before each commit:

- **ESLint**: JavaScript code quality and style
- **Prettier**: Code formatting
- **Stylelint**: CSS code quality

### Available Scripts

```bash
# Run linting checks
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changing files
npm run format:check

# Run all pre-commit checks
npm run pre-commit
```

### Code Quality Guidelines

1. **Always run `npm run lint` before committing**
2. **Use `npm run format` to automatically format code**
3. **Fix any ESLint errors before pushing**
4. **Follow the established code style guidelines**

### Common Issues and Solutions

#### Trailing Spaces
- **Issue**: Lines ending with spaces
- **Solution**: Run `npm run format` to automatically remove

#### Missing Trailing Commas
- **Issue**: Objects missing trailing commas
- **Solution**: Run `npm run format` to automatically add

#### ESLint Errors
- **Issue**: JavaScript code quality issues
- **Solution**: Run `npm run lint:fix` to automatically fix most issues

## Project Structure

```
├── blocks/          # AEM Blocks
├── scripts/         # JavaScript utilities
├── styles/          # CSS styles
├── tools/           # Development tools
└── plugins/         # AEM Plugins
```

## Contributing

1. Make your changes
2. Run `npm run pre-commit` to check code quality
3. Fix any issues found
4. Commit your changes
5. Push to remote repository
