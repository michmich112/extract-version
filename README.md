# Extract-Version
![repos](https://actions.boringday.co/api/badge?owner=michmich112&repo=extract-version&metric=repos)
---
Extract version from any file by specifying the version schema and where to find it.
The extracted version is returned as output for you to use in your GitHub actions workflow.

# Example usage
```yaml
name: Get version test

on:
  push:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Get version
        # id must be specified to retrieve the output of the step
        id: version-step
        uses: michmich112/extract-version@main
        with:
          # specify here the path to your version file (e.g. package.json, pom.xml...)
          version-file: VERSION
          schema: major.minor.build
      - name: test
        run: |
          echo "version -> $VERSION"
        env:
          VERSION: ${{ steps.version-step.outputs.version }}
```

## Version Schema
You can define any version schema you want so all of the appropriate version information
is extracted. You can use any word to define what the number in that emplacement in the version
signifies.\
Example for semantic versioning `major.minor.build`: using version `12.3.45`
- major: `12`
- minor: `3`
- build: `45`

### Seperators
Seperators are used to seperate the different version components. Allowed seperators are:
`.,;:-_><`

### Optional version component
Some of your version components in your scheme may not always be present. If that is the case, use 
square brackets to indicate their optionality.\
Example: `major.minor.build[-dev]`
- will match `1.2.3-56`
- will also match `1.2.3`

### Examples
You can define your own versioning schema as long as it correctly maps what you use:\
Example: `major.minor.build[-patch][->dev]`
- will match `3.4.5-34->12`
- will match `3.4.5-0->12`
- will match `3.4.5-1`
- will match `3.4.5`

## More examples
To see more examples, check out [version-bumper](https://github.com/michmich112/version-bumper) which automatically bumps 
your versions based on the branching model you define and customize.

## Notes
This action uses the `gh-action-stats` package to track usage. See the data collected at [gh-action-stats-js](https://github.com/michmich112/gh-action-stats-js).

