const fs = require('fs')
const { ApolloServer } = require('apollo-server')
const path = require('path')

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  }
]

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) =>  links.find(link => link.id === args.id),
  },

  Mutation: {
    post: (parent, args) => {
      let idCount = links.length

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },

    updateLink: (parent, args) => {
      const link = links.find(link => link.id === args.id)
      link.url = args.url ?? link.url
      link.description = args.description ?? link.description
      return link
    },

    deleteLink: (parent, args) => {
      const link = links.find(link => link.id === args.id)
      links = links.filter(link => link.id !== args.id)
      return link
    },
  },
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );