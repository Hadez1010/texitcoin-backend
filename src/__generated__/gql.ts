/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query FetchMe {\n    me {\n      id\n      username\n      email\n    }\n  }\n": types.FetchMeDocument,
    "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n    }\n  }\n": types.LoginDocument,
    "\n  mutation CreateUser($data: CreateUserInput!) {\n    createUser(data: $data) {\n      username\n      fullname\n      sponsorName\n      introducerFullName\n      email\n      mobile\n      assetId\n      commissionPayout\n      txcPayout\n      txcCold\n      isAdmin\n      createdAt\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation UpdateUser($data: UpdateUserInput!) {\n    updateUser(data: $data) {\n      id\n      username\n      fullname\n      sponsorName\n      introducerFullName\n      email\n      mobile\n      assetId\n      commissionPayout\n      txcPayout\n      txcCold\n      isAdmin\n    }\n  }\n": types.UpdateUserDocument,
    "\n  query FetchUser($filter: JSONObject) {\n    users(filter: $filter) {\n      users {\n        id\n        username\n        fullname\n        sponsorName\n        introducerFullName\n        email\n        password\n        mobile\n        assetId\n        commissionPayout\n        txcPayout\n        txcCold\n        isAdmin\n        sales {\n          invoiceNo\n          amount\n          hashPower\n          productName\n          paymentMethod\n          issuedAt\n          statistics {\n            newBlocks\n            newHashPower\n            totalBlocks\n            totalHashPower\n            members\n            issuedAt\n          }\n        }\n      }\n    }\n  }\n": types.FetchUserDocument,
    "\n  query FetchUserStats($adminFilter: JSONObject, $apFilter: JSONObject) {\n    all: users {\n      total\n    }\n    admin: users(filter: $adminFilter) {\n      total\n    }\n    ap: users(filter: $apFilter) {\n      total\n    }\n  }\n": types.FetchUserStatsDocument,
    "\n  query FetchUsers($page: String, $filter: JSONObject, $sort: String) {\n    users(page: $page, filter: $filter, sort: $sort) {\n      users {\n        id\n        username\n        fullname\n        sponsorName\n        introducerFullName\n        email\n        password\n        mobile\n        assetId\n        commissionPayout\n        txcPayout\n        txcCold\n        isAdmin\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n": types.FetchUsersDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchMe {\n    me {\n      id\n      username\n      email\n    }\n  }\n"): (typeof documents)["\n  query FetchMe {\n    me {\n      id\n      username\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUser($data: CreateUserInput!) {\n    createUser(data: $data) {\n      username\n      fullname\n      sponsorName\n      introducerFullName\n      email\n      mobile\n      assetId\n      commissionPayout\n      txcPayout\n      txcCold\n      isAdmin\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($data: CreateUserInput!) {\n    createUser(data: $data) {\n      username\n      fullname\n      sponsorName\n      introducerFullName\n      email\n      mobile\n      assetId\n      commissionPayout\n      txcPayout\n      txcCold\n      isAdmin\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateUser($data: UpdateUserInput!) {\n    updateUser(data: $data) {\n      id\n      username\n      fullname\n      sponsorName\n      introducerFullName\n      email\n      mobile\n      assetId\n      commissionPayout\n      txcPayout\n      txcCold\n      isAdmin\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($data: UpdateUserInput!) {\n    updateUser(data: $data) {\n      id\n      username\n      fullname\n      sponsorName\n      introducerFullName\n      email\n      mobile\n      assetId\n      commissionPayout\n      txcPayout\n      txcCold\n      isAdmin\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchUser($filter: JSONObject) {\n    users(filter: $filter) {\n      users {\n        id\n        username\n        fullname\n        sponsorName\n        introducerFullName\n        email\n        password\n        mobile\n        assetId\n        commissionPayout\n        txcPayout\n        txcCold\n        isAdmin\n        sales {\n          invoiceNo\n          amount\n          hashPower\n          productName\n          paymentMethod\n          issuedAt\n          statistics {\n            newBlocks\n            newHashPower\n            totalBlocks\n            totalHashPower\n            members\n            issuedAt\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchUser($filter: JSONObject) {\n    users(filter: $filter) {\n      users {\n        id\n        username\n        fullname\n        sponsorName\n        introducerFullName\n        email\n        password\n        mobile\n        assetId\n        commissionPayout\n        txcPayout\n        txcCold\n        isAdmin\n        sales {\n          invoiceNo\n          amount\n          hashPower\n          productName\n          paymentMethod\n          issuedAt\n          statistics {\n            newBlocks\n            newHashPower\n            totalBlocks\n            totalHashPower\n            members\n            issuedAt\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchUserStats($adminFilter: JSONObject, $apFilter: JSONObject) {\n    all: users {\n      total\n    }\n    admin: users(filter: $adminFilter) {\n      total\n    }\n    ap: users(filter: $apFilter) {\n      total\n    }\n  }\n"): (typeof documents)["\n  query FetchUserStats($adminFilter: JSONObject, $apFilter: JSONObject) {\n    all: users {\n      total\n    }\n    admin: users(filter: $adminFilter) {\n      total\n    }\n    ap: users(filter: $apFilter) {\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchUsers($page: String, $filter: JSONObject, $sort: String) {\n    users(page: $page, filter: $filter, sort: $sort) {\n      users {\n        id\n        username\n        fullname\n        sponsorName\n        introducerFullName\n        email\n        password\n        mobile\n        assetId\n        commissionPayout\n        txcPayout\n        txcCold\n        isAdmin\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query FetchUsers($page: String, $filter: JSONObject, $sort: String) {\n    users(page: $page, filter: $filter, sort: $sort) {\n      users {\n        id\n        username\n        fullname\n        sponsorName\n        introducerFullName\n        email\n        password\n        mobile\n        assetId\n        commissionPayout\n        txcPayout\n        txcCold\n        isAdmin\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;