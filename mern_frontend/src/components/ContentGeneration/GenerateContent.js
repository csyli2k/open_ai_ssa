import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import StatusMessage from "../Alert/StatusMessage";
import { getUserProfileAPI } from "../../apis/users/usersAPI";
import { generateContentAPI } from "../../apis/chatGPT/chatGPT";

const BlogPostAIAssistant = () => {
  const [generatedContent, setGeneratedContent] = useState("");
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
  });

  // //muation
  const mutation = useMutation({
    mutationFn: generateContentAPI,
    mutationKey: "contentMutation",
    onSuccess: (data) => {
      // This is called when the mutation is successful
      setGeneratedContent(`Generated content for prompt: ${data?.content}`);
    },
  });
  // const {
  //   data: content_Data,
  //   isSuccess: content_isSuccess,
  //   isLoading: content_isLoading,
  // } = mutation;

  // Formik setup for handling form data
  const formik = useFormik({
    initialValues: {
      prompt: "",
      // tone: "",
      // category: "",
    },
    validationSchema: Yup.object({
      prompt: Yup.string().required("A prompt is required"),
      // tone: Yup.string().required("Selecting a tone is required"),
      // category: Yup.string().required("Selecting a category is required"),
    }),
    onSubmit: (values) => {
      // Simulate content generation based on form values
      console.log(values);
      mutation.mutate(values);
    },
  });

  //display loading
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading in progress" />;
  }
  if (isError) {
    return (
      <StatusMessage type="error" message={error?.repsonses?.data?.message} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-2xl w-full p-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          AI Blog Post Generator
        </h2>
        {/* add status message for loading content generation */}
        {mutation?.isLoading && (
          <StatusMessage type="loading" message="Loading, in progress" />
        )}
        {mutation?.isError && (
          <StatusMessage
            type="Error"
            message={mutation?.data?.repsonses?.error}
          />
        )}
        {mutation?.isSuccess && (
          <StatusMessage type="success" message="Content generated" />
        )}
        {/* Static display for Plan and Credits */}
        <div className="flex mt-3">
          <div className="mr-2 mb-2">
            <span className="text-sm font-semibold bg-green-200 px-4 py-2 rounded-full">
              Plan: {data?.user?.subscriptionPlan}
            </span>
          </div>

          <div className="mr-2 mb-2">
            <span className="text-sm font-semibold bg-green-200 px-4 py-2 rounded-full">
              Credit: {data?.user?.apiRequestCount} /{" "}
              {data?.user?.monthlyRequestCount}
            </span>
          </div>
        </div>

        {/* Form for generating content */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Prompt input field */}
          <div>
            <label
              htmlFor="prompt"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Enter a topic or idea
            </label>
            <input
              id="prompt"
              type="text"
              {...formik.getFieldProps("prompt")}
              className="px-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a topic or idea"
            />
            {formik.touched.prompt && formik.errors.prompt && (
              <div className="text-red-500 mt-1">{formik.errors.prompt}</div>
            )}
          </div>

          {/* Tone selection field */}
          {/* <div>
            <label
              htmlFor="tone"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Select Tone
            </label>
            <select
              id="tone"
              {...formik.getFieldProps("tone")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a tone...</option>
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
              <option value="humorous">Humorous</option>
            </select>
            {formik.touched.tone && formik.errors.tone && (
              <div className="text-red-500 mt-1">{formik.errors.tone}</div>
            )}
          </div> */}

          {/* Category selection field */}
          {/* <div>
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Select Category
            </label>
            <select
              id="category"
              {...formik.getFieldProps("category")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a category...</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="business">Business</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500 mt-1">{formik.errors.category}</div>
            )}
          </div> */}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Content
          </button>
          {/* Link to view history */}
          <Link to="/history">View history</Link>
        </form>

        {/* Display generated content */}
        {generatedContent && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Generated Content:
            </h3>
            <p className="text-gray-600">{generatedContent}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostAIAssistant;
