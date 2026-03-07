"""GraphQL schema for blog API."""
import graphene
from graphene import ObjectType, Field, String, Int, List, Mutation


class AuthorType(ObjectType):
    name = String()
    avatar = String()


class PostType(ObjectType):
    id = Int()
    title = String()
    excerpt = String()
    content = String()
    image = String()
    date = String()
    author = Field(AuthorType)
    tags = List(String)


class CreatePost(Mutation):
    class Arguments:
        title = String(default_value="New Post")
        excerpt = String(default_value="")
        content = String(default_value="")

    post = Field(PostType)
    success = graphene.Boolean()

    def mutate(self, info, title="New Post", excerpt="", content=""):
        from app import _create_post
        post = _create_post(title=title, excerpt=excerpt, content=content)
        if post is None:
            raise Exception("Failed to create post")
        return CreatePost(post=post, success=True)


class Query(ObjectType):
    posts = graphene.List(PostType)
    post = Field(PostType, id=graphene.Int(required=True))

    def resolve_posts(self, info):
        from app import _fetch_posts
        return _fetch_posts()

    def resolve_post(self, info, id):
        from app import _fetch_post
        return _fetch_post(id)


class Mutation(ObjectType):
    create_post = CreatePost.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
