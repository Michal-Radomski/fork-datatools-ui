import update from 'react-addons-update'

const projects = (state = {
  isFetching: false,
  all: null
}, action) => {
  let projects, projectIndex
  switch (action.type) {
    case 'CREATE_PROJECT':
      projects = [{
        isCreating: true,
        name: ''
      }, ...state.all]
      return update(state, { all: { $set: projects }})

    case 'CREATE_FEEDSOURCE':
        projectIndex = state.all.findIndex(p => p.id === action.projectId)
        const project = state.all[projectIndex]
        let newState = null
        console.log("adding fs to project", state.all[projectIndex]);


        // if project's feedSources array is undefined, add it
        if(!project.feedSources) {
          console.log('adding new fs array');
          newState = update(state, {all: {[projectIndex]: {$merge: {feedSources: []}}}})
        }

        // add new empty feed source to feedSources array
        const feedSource = {
          isCreating: true,
          name: ''
        }
        return update(newState || state, {all: {[projectIndex]: {feedSources: {$unshift: [feedSource]}}}})

    case 'REQUEST_PROJECTS':
      return update(state, { isFetching: { $set: true }})

    case 'RECEIVE_PROJECTS':
      return {
        isFetching: false,
        all: action.projects
      }

    case 'RECEIVE_PROJECT':
      if (!state.all) { // there are no current projects loaded
        projects = [action.project]
      } else { // projects already loaded
        projectIndex = state.all.findIndex(p => p.id === action.project.id)
        if (projectIndex === -1) { // projects loaded but not this one; add it
          projects = [
            ...state.all,
            action.project
          ]
        } else { // projects loaded including this one, replace it
          projects = [
            ...state.all.slice(0, projectIndex),
            action.project,
            ...state.all.slice(projectIndex + 1)
          ]
        }
      }
      return update(state, { all: { $set: projects }})

    case 'RECEIVE_FEEDSOURCES':
      projectIndex = state.all.findIndex(p => p.id === action.projectId)
      return update(state, {all: {[projectIndex]: {$merge: {feedSources: action.feedSources}}}})

    default:
      return state
  }
}

export default projects
