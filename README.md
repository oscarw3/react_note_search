# Modified Demo React App
This repo is a modified frontend React app based on the demo react app found here: [here](https://github.com/AnomalyInnovations/serverless-stack-demo-client). The following functionality have been added:
- Search notes: functionality on the homescreen that allows the user to search for notes containing a specific spring.
- Bulk find-and-replace: functionality that allows the user to replace all occurrences of a given string across all saved notes, with a new string supplied by the user. 
- Loading Indicator: added an indicator that appears while all the notes are being retrieved from the API for the homescreen, when an individual note is being loaded for viewing, and when find-and-replace is in progress.

### Future Improvements
Since this is a demo app, this is just for experimenting with react and the serverless stack. There are multiple ways in which it can be improved upon and should if productionized, for example:
- Adding highlighting when words have been selected
- Validations of the input text (handling super large texts, for example)
- Improve UI/css of the search bars and replace button
Just to name a few!

#### Usage

This project is created using [Create React App](https://github.com/facebookincubator/create-react-app).

To use this repo locally, start by cloning it and installing the NPM packages.

``` bash
$ git clone git@github.com:oscarw3/react_note_search.git
$ npm install
```

Run it locally.

``` bash
$ npm run start
```
