const { userData } = require("../db/data/test-data");
const {
  convertTimestampToDate,
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});



describe('formatTopics', () => {
  test('returns a nested array', () => {
    const input = [{ key: 'value' }];


    expect(typeof formatTopics(input)).toBe('object');
    expect(Array.isArray(formatTopics(input))).toEqual(true);
    expect(Array.isArray(formatTopics(input)[0])).toEqual(true);
  })
  test('when passed one array, returns a nested array with values placed in the order they are required in the topics table', () => {
    const input = [
      { description: "Code is love, code is life", slug: "coding", img_url: "" }]

    expect(formatTopics(input)).toEqual([
      ["coding", "Code is love, code is life", ""]])
  })
  test('when passed multiple arrays, returns a nested array with values placed in the order they are required in the topics table', () => {
    const input = [
      { description: "Code is love, code is life", slug: "coding", img_url: "" },
      {
        description: "FOOTIE!",
        slug: "football",
        img_url:
          "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?w=700&h=700",
      },
      {
        description: "Hey good looking, what you got cooking?",
        slug: "cooking",
        img_url:
          "https://images.pexels.com/photos/33242/cooking-ingredient-cuisine-kitchen.jpg?w=700&h=700",
      },
    ]
    expect(formatTopics(input)).toEqual([
      ["coding", "Code is love, code is life", ""], ["football", "FOOTIE!", "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg?w=700&h=700"], ["cooking", "Hey good looking, what you got cooking?", "https://images.pexels.com/photos/33242/cooking-ingredient-cuisine-kitchen.jpg?w=700&h=700"]])
  })
})


describe('formatUsers', () => {
  test('returns an array of arrays', () => {

    const input = [{ key: 'value' }];


    expect(typeof formatTopics(input)).toBe('object');
    expect(Array.isArray(formatTopics(input))).toEqual(true);
    expect(Array.isArray(formatTopics(input)[0])).toEqual(true);

  })
  test('when passed a single array returns a nested array', () => {

    const input = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      }]

    expect(formatUsers(input)).toEqual([['tickle122', 'Tom Tickle', 'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953']])

  })

  test('when passed a multiple arrays returns multiple nested arrays', () => {

    const input = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      },
      {
        username: 'grumpy19',
        name: 'Paul Grump',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013'
      },
      {
        username: 'happyamy2016',
        name: 'Amy Happy',
        avatar_url:
          'https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729'
      }]
    expect(formatUsers(input)).toEqual([['tickle122', 'Tom Tickle', 'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'], ['grumpy19', 'Paul Grump', 'https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013'], ['happyamy2016', 'Amy Happy', 'https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729']])

  })

})

describe('formatArticles', () => {

  test('returns a nested array', () => {
    input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1604728980000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
      }]

    expect(typeof formatArticles(input)).toBe('object');
    expect(Array.isArray(formatTopics(input))).toEqual(true);
    expect(Array.isArray(formatTopics(input)[0])).toEqual(true);
  })
  test('when passes a single article array returns a new formatted nested array with values matching the order of the articles table ', () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1604728980000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
      }]
    expect(formatArticles(input)).toEqual([["Running a Node App",
      "coding", "jessjelly",
      "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
      new Date(input[0].created_at),
      0,
      "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700"]])

  })
  test('when passed multiple arrays returns new formatted nesteded arrays with values matching the order of the articles table', () => {

    const input =

      [
        {
          title: "Running a Node App",
          topic: "coding",
          author: "jessjelly",
          body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
          created_at: 1604728980000,
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
        },
        {
          title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
          topic: "coding",
          author: "jessjelly",
          body: "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
          created_at: 1589418120000,
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700",
        }]

    expect(formatArticles(input)).toEqual([["Running a Node App",
      "coding", "jessjelly",
      "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
      new Date(input[0].created_at),
      0,
      "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700"],
    ["The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
      "coding",
      "jessjelly",
      "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
      new Date(input[1].created_at),
      0,
      "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700"
    ]])
  })
})

// article data, userdata, commentsdata
describe('formatComments', () => {

  test('returns a nested array', () => {
    const articleData = [
      {
        article_id: 1,
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1604728980000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
      }]
    const userData = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      }]

    const commentsData = [{
      article_title: "Running a Node App",
      body: "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
      votes: -1,
      author: "tickle122",
      created_at: 1590103140000,
    }]

    expect(typeof formatComments(articleData, userData, commentsData)).toBe('object');
    expect(Array.isArray(formatComments(articleData, userData, commentsData))).toEqual(true);
    expect(Array.isArray(formatComments(articleData, userData, commentsData)[0])).toEqual(true);
  })

  test('returns a nested array with all the required fields in the right order fot the comments table', () => {
    const articleData = [
      {
        article_id: 1,
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1604728980000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
      }]
    const userData = [
      {
        username: 'tickle122',
        name: 'Tom Tickle',
        avatar_url:
          'https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953'
      }]

    const commentsData = [{
      article_title: "Running a Node App",
      body: "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
      votes: -1,
      author: "tickle122",
      created_at: 1590103140000,
    }]

    expect(formatComments(articleData, userData, commentsData)).toEqual([[1,
      "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
      -1,
      'tickle122',
      new Date(commentsData[0].created_at)
    ]])
  })
})


