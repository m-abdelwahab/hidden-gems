import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getSession, useSession } from "next-auth/client";
import gql from "graphql-tag";
import { withUrqlClient } from "next-urql";
import { useMutation } from "urql";
import prisma from "lib/prisma";

const CreateLinkMutation = gql`
  mutation(
    $title: String!
    $url: String!
    $imageUrl: String!
    $category: String!
    $description: String!
  ) {
    createLink(
      title: $title
      url: $url
      imageUrl: $imageUrl
      category: $category
      description: $description
    ) {
      title
      url
      imageUrl
      category
      description
    }
  }
`;

const CreateLink = ({ user }) => {
  const [createLinkResult, createLink] = useMutation(CreateLinkMutation);

  const { register, handleSubmit, errors } = useForm();
  const [isCreating, setIsCreating] = useState(false);

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-image?file=${filename}`);
    const data = await res.json();
    console.log(data);
    const formData = new FormData();

    Object.entries({ ...data.fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const upload = await fetch(data.url, {
      method: "POST",
      body: formData,
    });
    console.log(upload);
    if (upload.ok) {
      console.log("Uploaded successfully!");
    } else {
      console.error("Upload failed :(");
    }
  };

  const onSubmit = async (data) => {
    setIsCreating(true);
    const { title, url, category, description, image } = data;
    const imageUrl = `https://awesome-hidden-gems.s3.amazonaws.com/${image[0].name}`;
    const variables = { title, url, category, description, imageUrl };
    try {
      const res = await createLink(variables);

      console.log(createLinkResult.fetching);
      console.log(res);
      setIsCreating(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto max-w-md pt-12">
      <h1 className="text-3xl font-medium my-5">Create a New Link</h1>
      <form
        className="grid grid-cols-1 gap-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">Title</span>
          <input
            placeholder="Title"
            ref={register({ required: true })}
            name="title"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.title && (
            <p className="text-red-500 mt-2">This field is required</p>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Description</span>
          <input
            placeholder="Description"
            ref={register({ required: true })}
            name="description"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.description && (
            <p className="text-red-500 mt-2">This field is required</p>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Url</span>
          <input
            placeholder="https://example.com"
            ref={register({ required: true })}
            name="url"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.url && (
            <p className="text-red-500 mt-2">This field is required</p>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">Category</span>
          <input
            placeholder="Name"
            ref={register({ required: true })}
            name="category"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.category && (
            <p className="text-red-500 mt-2">This field is required</p>
          )}
        </label>
        <label className="block">
          <span className="text-gray-700">
            Upload a .png or .jpg image (max 1MB).
          </span>
          <input
            ref={register({ required: true })}
            onChange={uploadPhoto}
            type="file"
            accept="image/png, image/jpeg"
            name="image"
          />
        </label>
        {errors.image && (
          <p className="text-red-500 mt-2">This field is required</p>
        )}
        <button
          type="submit"
          className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {isCreating ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-6 h-6 animate-spin mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              Creating...
            </span>
          ) : (
            <span>Create Link</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default withUrqlClient(() => ({
  url: "http://localhost:3000/api/graphql",
}))(CreateLink);

// TODO: possibly clean this up
export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { res } = context;

  if (session) {
    const email = session.user.email;
    const admin = await prisma.user.findMany({
      where: { role: "ADMIN", email },
    });
    if (admin.length === 0) {
      res.writeHead(301, { location: "/api/auth/signin" });
      res.end();
    }
    const { name, image } = admin[0];
    return {
      props: {
        user: {
          name,
          image,
          email,
        },
      },
    };
  } else {
    res.writeHead(301, { location: "/api/auth/signin" });
    res.end();
    return {
      props: {},
    };
  }
}
