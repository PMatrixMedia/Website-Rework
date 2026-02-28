"""GraphQL schema for blog API."""
import graphene
from graphene import ObjectType, Field, String, Int, List


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


class Query(ObjectType):
    posts = graphene.List(PostType)
    post = Field(PostType, id=graphene.Int(required=True))

    def resolve_posts(self, info):
        from app import _fetch_posts
        return _fetch_posts()

    def resolve_post(self, info, id):
        from app import _fetch_post
        return _fetch_post(id)


schema = graphene.Schema(query=Query)
