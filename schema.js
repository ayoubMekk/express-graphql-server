const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLSchema, GraphQLList } = require('graphql');

const Book = require('./models/Book');
const Author = require('./models/Author');

// author type
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({ authorId: parent.id })
            }
        }
    })
})

// book type
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        pages: { type: GraphQLInt },
        author: {
            type: AuthorType,
            resolve(parent, agrs) {
                return Author.findById(parent.authorId)
            }
        }
    })
})

// root query
const rootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Book.findById(args.id).then((res) => b)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve() {
                return Book.find();
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Author.findById(args.id)
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve() {
                return Author.find();
            }
        }
    })
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return new Author(args).save()
            }
        },
        updateAuthor: {
            type: AuthorType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return Author.findByIdAndUpdate(args.id, args, { useFindAndModify: false })
            }
        },
        deleteAuthor: {
            type: AuthorType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return Author.findByIdAndDelete({ _id: args.id })
            }
        },
        deleteAllAuthors: {
            type: AuthorType,
            resolve(parent, args) {
               return Author.remove({});
            }
        },
        addBook: {
            type: BookType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                pages: { type: new GraphQLNonNull(GraphQLInt) },
                authorId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return new Book(args).save()
            }
        },
        updateBook: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                title: { type: GraphQLString },
                pages: { type: GraphQLInt },
                authorId: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Book.findByIdAndUpdate(args.id, args, { useFindAndModify: false })
            }
        },
        deleteBook: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return Book.findByIdAndDelete({ _id: args.id })
            }
        },
        deleteAllBooks: {
            type: BookType,
            resolve(parent, args) {
                return Book.remove({});
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: rootQuery,
    mutation
})