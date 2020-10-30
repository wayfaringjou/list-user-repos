'use-strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

// The repos associated with that handle must be displayed on the page.
function displayRepoList(dataJson) {
  $('#js-results-list').empty();

  for (let i = 0; i < dataJson.length; i++) {
    $('#js-results-list').append(
      `
      <li>
      <h3><a href="${dataJson[i].url}">${dataJson[i].full_name}</a></h3>
      <h4>${dataJson[i].description}</h4>
      `,
    );
  }
  $('.js-results').removeClass('hidden');
}
// You must display the repo name and link to the repo URL.
// The user must be able to make multiple searches and see only the results for the current search.

// The search must trigger a call to GitHub's API.
function fetchRepos(username, sortParam = 'updated', directionParam = 'desc') {
  const entrypoint = 'https://api.github.com';
  const endpoint = `/users/${username}/repos`;
  const options = { headers: new Headers({ 'accept': 'application/vnd.github.v3+json' }) };
  const params = {
    sort: sortParam,
    direction: directionParam,
  };

  const url = `${entrypoint}${endpoint}?${formatQueryParams(params)}`;

  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((dataJson) => displayRepoList(dataJson))
    .catch((error) => {
      $('#js-error').text(`An error ocurred: ${error.message}`);
      $('.js-results').addClass('hidden');
      $('#js-results-list').empty();
    });
}

function inputHandler() {
  $('main').on('submit', '.js-user-input-form', function (e) {
    e.preventDefault();
    const username = $(this).find('#user-input').val().toLowerCase();
    const sortParam = $(this).find('#sort-type').val();
    const directionParam = $(this).find('#direction').val();
    fetchRepos(username, sortParam, directionParam);
  });
}

$(inputHandler);
