const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const sqlite = require('sqlite3')
const { query } = require('express')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const csrf = require('csurf')
const cookie = require('cookie-parser')


const app = express()

const db = new sqlite.Database('databas.db')

app.use(cookie())

const csrfProtection = csrf({ cookie: true })

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'asddasasfdfasffdsgrg',
    store: new SQLiteStore({ db: "session.db" })
}))

app.use('/static', express.static("public"))

app.use(express.urlencoded({
    extended: true
}))

app.engine("hbs", expressHandlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    partialsDir: __dirname + '/views/partials'
}))

app.use(function (request, response, next) {
    response.locals.isLoggedIn = request.session.isLoggedIn
    next()
})


const ADMIN_USERNAME = "kevve"
const ADMIN_PASSWORD = "admin"

const MIN_BLOG_TITLE_LENGTH = 5
const MAX_BLOG_TITLE_LENGTH = 20
const MIN_BLOG_DESCRIPTION_LENGTH = 5
const MAX_BLOG_DESCRIPTION_LENGTH = 20
const MIN_BLOG_MAINCONTENT_LENGTH = 5
const MAX_BLOG_MAINCONTENT_LENGTH = 20

const MIN_PROJECT_TITLE_LENGTH = 5
const MAX_PROJECT_TITLE_LENGTH = 20
const MIN_PROJECT_DESCRIPTION_LENGTH = 5
const MAX_PROJECT_DESCRIPTION_LENGTH = 20
const MIN_PROJECT_MAINCONTENT_LENGTH = 5
const MAX_PROJECT_MAINCONTENT_LENGTH = 20

const MIN_COMMENT_LENGTH = 5
const MAX_COMMENT_LENGTH = 20

function createBlogValidationErrors(title, description, mainContent) {
    const validationErrors = []
    if (title.length < MIN_BLOG_TITLE_LENGTH) {
        validationErrors.push("The title need to be longer then " + MIN_BLOG_TITLE_LENGTH + " long.")
    } else if (title.length > MAX_BLOG_TITLE_LENGTH) {
        validationErrors.push("The title can't be longer then " + MAX_BLOG_TITLE_LENGTH)
    }

    if (description.length < MIN_BLOG_DESCRIPTION_LENGTH) {
        validationErrors.push("The description need to be longer then " + MIN_BLOG_DESCRIPTION_LENGTH)
    } else if (description.length > MAX_BLOG_DESCRIPTION_LENGTH) {
        validationErrors.push("The description can not be longer then " + MAX_BLOG_DESCRIPTION_LENGTH)
    }

    if (mainContent.length < MIN_BLOG_MAINCONTENT_LENGTH) {
        validationErrors.push("The content has to be atleast " + MIN_BLOG_MAINCONTENT_LENGTH + " long.")
    } else if (mainContent.length > MAX_BLOG_MAINCONTENT_LENGTH) {
        validationErrors.push("The content has to be less then " + MAX_BLOG_MAINCONTENT_LENGTH + " long")
    }
    return validationErrors
}

function editBlogValidationErrors(title, description, mainContent) {
    const validationErrors = []
    if (title.length < MIN_BLOG_TITLE_LENGTH) {
        validationErrors.push("The title need to be longer then " + MIN_BLOG_TITLE_LENGTH + " long.")
    } else if (title.length > MAX_BLOG_TITLE_LENGTH) {
        validationErrors.push("The title can't be longer then " + MAX_BLOG_TITLE_LENGTH)
    }

    if (description.length < MIN_BLOG_DESCRIPTION_LENGTH) {
        validationErrors.push("The description need to be longer then " + MIN_BLOG_DESCRIPTION_LENGTH)
    } else if (description.length > MAX_BLOG_DESCRIPTION_LENGTH) {
        validationErrors.push("The description can not be longer then " + MAX_BLOG_DESCRIPTION_LENGTH)
    }

    if (mainContent.length < MIN_BLOG_MAINCONTENT_LENGTH) {
        validationErrors.push("The content has to be atleast " + MIN_BLOG_MAINCONTENT_LENGTH + " long.")
    } else if (mainContent.length > MAX_BLOG_MAINCONTENT_LENGTH) {
        validationErrors.push("The content has to be less then " + MAX_BLOG_MAINCONTENT_LENGTH + " long")
    }
    return validationErrors
}

function createProjectValidationErrors(title, description, mainContent) {
    const validationErrors = []
    if (title.length < MIN_PROJECT_TITLE_LENGTH) {
        validationErrors.push("The title needs to be longer then " + MIN_PROJECT_TITLE_LENGTH)
    } else if (title.length > MAX_PROJECT_TITLE_LENGTH) {
        validationErrors.push("The title can not be longer then " + MAX_PROJECT_TITLE_LENGTH)
    }

    if (description.length < MIN_PROJECT_DESCRIPTION_LENGTH) {
        validationErrors.push("The description needs to be longer then " + MIN_PROJECT_DESCRIPTION_LENGTH)
    } else if (description.length > MAX_PROJECT_DESCRIPTION_LENGTH) {
        validationErrors.push("The description can't be longer then " + MAX_PROJECT_DESCRIPTION_LENGTH)
    }

    if (mainContent.length < MIN_PROJECT_MAINCONTENT_LENGTH) {
        validationErrors.push("The main content needs to be longer then " + MIN_PROJECT_MAINCONTENT_LENGTH)
    } else if (mainContent > MAX_PROJECT_MAINCONTENT_LENGTH) {
        validationErrors.push("The main content can't be longer then " + MAX_PROJECT_MAINCONTENT_LENGTH)
    }
    return validationErrors
}

function editProjectValidationErrors(title, description, mainContent) {
    const validationErrors = []
    if (title.length < MIN_PROJECT_TITLE_LENGTH) {
        validationErrors.push("The title needs to be longer then " + MIN_PROJECT_TITLE_LENGTH)
    } else if (title.length > MAX_PROJECT_TITLE_LENGTH) {
        validationErrors.push("The title can not be longer then " + MAX_PROJECT_TITLE_LENGTH)
    }

    if (description.length < MIN_PROJECT_DESCRIPTION_LENGTH) {
        validationErrors.push("The description needs to be longer then " + MIN_PROJECT_DESCRIPTION_LENGTH)
    } else if (description.length > MAX_PROJECT_DESCRIPTION_LENGTH) {
        validationErrors.push("The description can't be longer then " + MAX_PROJECT_DESCRIPTION_LENGTH)
    }

    if (mainContent.length < MIN_PROJECT_MAINCONTENT_LENGTH) {
        validationErrors.push("The main content needs to be longer then " + MIN_PROJECT_MAINCONTENT_LENGTH)
    } else if (mainContent > MAX_PROJECT_MAINCONTENT_LENGTH) {
        validationErrors.push("The main content can't be longer then " + MAX_PROJECT_MAINCONTENT_LENGTH)
    }
    return validationErrors
}

function createCommentValidationErrors(content) {
    const validationErrors = []
    if (content.length < MIN_COMMENT_LENGTH) {
        validationErrors.push("You can't write a comment shorter then " + MIN_COMMENT_LENGTH)
    } else if (content.length > MAX_COMMENT_LENGTH) {
        validationErrors.push("You can't write a comment that's longer then" + MAX_COMMENT_LENGTH)
    }
    return validationErrors
}

function loginAttempt(username, password) {
    const validationErrors = []
    if (username != ADMIN_USERNAME) {
        validationErrors.push("Wrong username")
    }
    if (password != ADMIN_PASSWORD) {
        validationErrors.push("Wrong password")
    }
    return validationErrors
}



//---------------------Databas-------------------------


db.run(`
    CREATE TABLE IF NOT EXISTS blogposts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        mainContent TEXT
    )
`)

db.run(`
        CREATE TABLE IF NOT EXISTS projectposts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            mainContent TEXT
        )
`)

db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            blogPostID INTEGER,
            FOREIGN KEY (blogPostID) REFERENCES blogposts (id)
        )
`)

//-----------------Get request--------------------
app.get('/', function (request, response) {

    response.render("index.hbs", {})
})

app.get('/about', function (request, response) {

    response.render('about.hbs', {})
})

app.get('/contact', function (request, response) {

    response.render('contact.hbs', {})
})

//-----------------project Part-------------------

app.get('/projects', function (request, response) {

    const query = "SELECT * FROM projectposts"

    db.all(query, function (error, projectposts) {
        if (error) {
            response.render("internalServerError.hbs")
        } else {
            const model = {
                projectposts
            }
            response.render('projects.hbs', model)
        }
    })


})

app.get('/projects/createProject', csrfProtection, function (request, response) {

    response.render("createProject.hbs", { csrfToken: request.csrfToken() })
})

app.post('/projects/createProject', csrfProtection, function (request, response) {

    const title = request.body.title
    const description = request.body.description
    const mainContent = request.body.mainContent

    const query = "INSERT INTO projectposts(title, description, mainContent) VALUES(?, ?, ?)"

    const values = [title, description, mainContent]


    let validationErrors = createProjectValidationErrors(title, description, mainContent)
    if (validationErrors == 0) {
        db.run(query, values, function (error) {
            if (error) {
                response.render("internalServerError.hbs")
            } else {
                response.redirect("/projects")
            }
        })
    } else {
        const model = {
            validationErrors
        }
        response.render("createProject.hbs", model)
    }

})

app.get('/projectPost/:id', function (request, response) {

    const id = request.params.id

    const query = "SELECT * FROM projectposts WHERE id = ?"

    const values = [id]

    db.get(query, values, function (error, projectposts) {
        if (error) {
            response.render("internalServerError.hbs")
        } else {
            if (projectposts == undefined) {
                return response.render("pageNotFound.hbs")
            }
            const model = {
                projectposts
            }
            response.render("projectPost.hbs", model)
        }

    })

})

app.get('/projectPost/:id/editProject', csrfProtection, function (request, response) {

    const id = request.params.id

    const query = "SELECT * FROM projectposts WHERE id = ?"

    const values = [id]

    db.get(query, values, function (error, projectposts) {
        if (error) {
            response.render("internalServerError.hbs")
        } else {
            if (projectposts == undefined) {
                return response.render("pageNotFound.hbs")
            }
            const model = {

                projectposts,
                csrfToken: request.csrfToken()

            }
            response.render("editProject.hbs", model)
        }
    })

})

app.post('/projectPost/:id/editProject', csrfProtection, function (request, response) {

    const title = request.body.title
    const description = request.body.description
    const mainContent = request.body.mainContent
    const id = request.params.id

    const query = "UPDATE projectposts SET title = ?, description = ?, mainContent = ? WHERE id = ?"

    const values = [title, description, mainContent, id]

    let validationErrors = editProjectValidationErrors(title, description, mainContent)
    if (validationErrors == 0) {
        db.run(query, values, function (error) {
            if (error) {
                response.render("internalServerError.hbs")
            } else {
                response.redirect('/projectPost/' + id)
            }
        })
    } else {
        const model = {
            validationErrors,
            csrfToken: request.csrfToken(),
            projectposts: {
                title,
                description,
                mainContent,
                id
            }

        }
        response.render("editProject.hbs", model)
    }

})

app.get('/projectPost/:id/projectDelete', csrfProtection, function (request, response) {

    const id = request.params.id

    const query = "SELECT * FROM projectposts WHERE id = ?"

    const values = [id]

    db.get(query, values, function (error, projectposts) {
        if (error) {
            response.render("internalServerError.hbs")
        } else {
            if (projectposts == undefined) {
                return response.render("pageNotFound.hbs")
            }
            const model = {
                projectposts,
                csrfToken: request.csrfToken()
            }
            response.render("projectDelete.hbs", model)
        }
    })



})

app.post('/projectPost/:id/projectDelete', csrfProtection, function (request, response) {

    const id = request.params.id
    const yes = request.body.yes
    const no = request.body.no

    if (yes) {

        const query = "DELETE FROM projectposts WHERE id = ?"

        const value = [id]

        db.all(query, value, function (error) {
            if (error) {
                response.render("internalServerError.hbs")
            } else {
                response.redirect("/projects")
            }
        })

    } else if (no) {
        response.redirect("/projectPost/" + id)
    }


})

//--------------------blog Part-----------------------

app.get('/blog', function (request, response) {

    const query = "SELECT * FROM blogposts"

    const errorArray = []

    db.all(query, function (error, blogposts) {
        if (error) {
            response.render("internalServerError.hbs")
        } else {
            const model = {
                blogposts
            }
            response.render("blog.hbs", model)
        }
    })


})

app.get('/blog/createBlog', csrfProtection, function (request, response) {

    response.render("createBlog.hbs", { csrfToken: request.csrfToken() })
})

app.post('/blog/createBlog', csrfProtection, function (request, response) {

    const title = request.body.title
    const description = request.body.description
    const mainContent = request.body.mainContent

    const query = "INSERT INTO blogposts(title, description, mainContent) VALUES(?, ?, ?)"

    const values = [title, description, mainContent]

    let validationErrors = createBlogValidationErrors(title, description, mainContent)
    if (validationErrors == 0) {
        db.run(query, values, function (error) {
            if (error) {
                response.render("internalServerError.hbs")
            } else {
                response.redirect("/blog")
            }
        })
    } else {

        const model = {
            validationErrors
        }
        response.render("createBlog.hbs", model)
    }

})

app.get('/blogPost/:id', function (request, response) {

    const id = request.params.id

    const query = "SELECT * FROM blogposts WHERE id = ?"

    const queryCom = "SELECT * FROM comments WHERE blogPostID = ?"

    const value = [id]

    db.get(query, value, function (error, blogposts) {
        db.all(queryCom, value, function (error, comments) {
            if (error) {
                response.render("internalServerError.hbs")
            } else {
                if (blogposts == undefined) {
                    return response.render("pageNotFound.hbs")
                }
                const model = {
                    blogposts,
                    comments
                }
                response.render("blogPost.hbs", model)
            }
        })
    })
})

app.get('/blogPost/:id/editBlog', csrfProtection, function (request, response) {

    const id = request.params.id

    const query = "SELECT * FROM blogposts WHERE id = ?"

    const values = [id]

    db.get(query, values, function (error, blogposts) {
        if (error) {
            response.render("internalServerError.hbs")
        } else {
            if (blogposts == undefined) {
                return response.render("pageNotFound.hbs")
            }
            const model = {
                blogposts,
                csrfToken: request.csrfToken()
            }
            response.render("editBlog.hbs", model)
        }
    })
})

app.post('/blogPost/:id/editBlog', csrfProtection, function (request, response) {

    const title = request.body.title
    const description = request.body.description
    const mainContent = request.body.mainContent
    const id = request.params.id

    const query = "UPDATE blogposts SET title = ?, description = ?, mainContent = ? WHERE id = ?"

    const values = [title, description, mainContent, id]
    let validationErrors = editBlogValidationErrors(title, description, mainContent)
    if (validationErrors == 0) {
        db.run(query, values, function (error) {
            if (error) {
                response.render("internalServerError.hbs")
            } else {
                response.redirect("/blogPost/" + id)
            }
        })
    } else {
        const model = {
            validationErrors,
            csrfToken: request.csrfToken(),
            blogposts: {
                title,
                description,
                mainContent,
                id
            }

        }
        response.render("editBlog.hbs", model)
    }

})



app.get('/blogPost/:id/blogDelete', csrfProtection, function (request, response) {

    const id = request.params.id

    const query = "SELECT * FROM blogposts WHERE id = ?"

    const values = [id]

    db.get(query, values, function (error, blogposts) {
        if (error) {
            response.render("internalServerError.hbs")
        } else {
            if (blogposts == undefined) {
                return response.render("pageNotFound.hbs")
            }
            const model = {
                blogposts,
                csrfToken: request.csrfToken()
            }
            response.render("blogDelete.hbs", model)
        }
    })
})

app.post('/blogPost/:id/blogDelete', csrfProtection, function (request, response) {

    const id = request.params.id
    const yes = request.body.yes
    const no = request.body.no

    if (yes) {

        const query = "DELETE FROM blogposts WHERE id = ?"

        const queryCom = "DELETE FROM comments WHERE blogPostID = ?"

        const value = [id]

        db.all(queryCom, value, function (error, comments) {
            db.run(query, value, function (error) {
                if (error) {
                    response.render("internalServerError.hbs")
                } else {

                    response.redirect("/blog")
                }
            })
        })
    } else if (no) {
        response.redirect("/blogPost/" + id)
    }

})

//---------------comments-----------------
app.get('/blogPost/:id/comment', function (request, response) {

    const blogID = request.params.id

    const model = {
        blogID
    }
    response.render("writeComment.hbs", model)


})

app.post('/blogPost/:id/comment', function (request, response) {
    const blogID = request.params.id
    const content = request.body.comment

    const query = "INSERT INTO comments(content, blogPostID) VALUES(?, ?)"

    const values = [content, blogID]

    let validationErrors = createCommentValidationErrors(content)
    if (validationErrors == 0) {
        db.run(query, values, function (error, comments) {
            if (error) {
                response.render("internalServerError.hbs")
            } else {
                if (comments == undefined) {
                    return response.render("pageNotFound.hbs")
                }
                response.redirect("/blogPost/" + blogID)
            }
        })
    } else {
        const model = {
            validationErrors,
            blogID,

        }
        response.render("writeComment.hbs", model)
    }

})



app.get('/Login', csrfProtection, function (request, response) {


    response.render("login.hbs", { csrfToken: request.csrfToken() })
})

app.post('/Login', csrfProtection, function (request, response) {
    const username = request.body.username
    const password = request.body.password

    let validationErrors = loginAttempt(username, password)

    if (validationErrors == 0 && username == ADMIN_USERNAME && password == ADMIN_PASSWORD) {
        request.session.isLoggedIn = true
        response.redirect("/Login")
    } else {
        const model = {
            validationErrors
        }
        response.render("login.hbs", model)
    }
})

app.post('/Logout', csrfProtection, function (request, response) {

    request.session.destroy(function (error) {
        if (error) {
            response.render("internalServerError.hbs", {})
        }
        response.redirect("/Login")
    })

})

app.use('/', function (request, response) {
    response.render("pageNotFound.hbs")
})


app.listen(8080)