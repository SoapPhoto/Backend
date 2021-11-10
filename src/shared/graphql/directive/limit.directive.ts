import { MapperKind, mapSchema } from '@graphql-tools/utils';
import {
  GraphQLFieldConfig,
  GraphQLInputFieldConfig,
  GraphQLScalarType, GraphQLSchema,
} from 'graphql';

// export function lengthDirective(directiveName: string) {
//   return {
//     lengthDirectiveTypeDefs: `directive @${directiveName}(max: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION`,
//     lengthDirectiveTransformer: (schema: GraphQLSchema) => mapSchema(schema, {
//       [MapperKind.FIELD]: (fieldConfig) => {
//         // eslint-disable-next-line no-shadow
//         const lengthDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
//         if (lengthDirective) {
//           return fieldConfig;
//         }
//       },
//     }),
//   };
// }

// export class LimitDirective extends SchemaDirectiveVisitor {
//   public visitFieldDefinition(field: GraphQLField<any, any>) {
//     const { resolve = defaultFieldResolver } = field;
//     const { number } = this.args;
//     field.args.push({
//       name: 'limit',
//       type: GraphQLFloat,
//     } as any);

//     // eslint-disable-next-line func-names
//     field.resolve = async function (
//       source,
//       { limit, ...otherArgs },
//       context,
//       info,
//     ) {
//       const result = await resolve.call(this, source, otherArgs, context, info);
//       if (isArray(result)) {
//         return result.slice(0, limit || number || 10);
//       }
//       return result;
//     };
//   }
// }
