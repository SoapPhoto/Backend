/** Dependencies **/
import * as fs from 'fs';
import * as path from 'path';
import mjml2html from 'mjml';
import _, { get } from 'lodash';
import { TemplateAdapter, MailerOptions } from '@nestjs-modules/mailer';

export class MjmlAdapter implements TemplateAdapter {
  public compile(mail: any, callback: any, mailerOptions: MailerOptions): void {
    const templateExt = `${path.extname(mail.data.template)}.mjml`;
    const templateName = path.basename(mail.data.template, path.extname(mail.data.template));
    const templateDir = path.dirname(mail.data.template) !== '.'
      ? path.dirname(mail.data.template)
      : get(mailerOptions, 'template.dir', '');
    const templatePath = path.join(templateDir, templateName + templateExt);

    const options = {
      ...mail.data.context,
      ...get(mailerOptions, 'template.options', {}),
    };

    let html = '';
    try {
      const template = fs.readFileSync(templatePath, {
        encoding: 'utf8',
      });
      ({ html } = mjml2html(
        _.template(template)({
          ...options,
          host: `${process.env.URL}`,
        }),
      ));
    } catch (err) {
      return callback(err);
    }
    mail.data.html = html;
    return callback();
  }
}
