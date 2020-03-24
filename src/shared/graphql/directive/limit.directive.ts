
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver, GraphQLField, GraphQLFloat } from 'graphql';
import { isArray } from 'lodash';

export class LimitDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field;
    const { number } = this.args;
    field.args.push({
      name: 'limit',
      type: GraphQLFloat,
    } as any);

    // eslint-disable-next-line func-names
    field.resolve = async function (
      source,
      { limit, ...otherArgs },
      context,
      info,
    ) {
      const result = await resolve.call(this, source, otherArgs, context, info);
      if (isArray(result)) {
        return result.slice(0, limit || number || 10);
      }
      return result;
    };
  }
}
