import { EmailTemplate, EmailBlock } from '../components/email-builder/types';

export function generateHtml(template: EmailTemplate): string {
    const { backgroundColor, fontFamily, children } = template.root;

    const renderBlock = (block: EmailBlock): string => {
        switch (block.type) {
            case 'text':
                return renderTextBlock(block);
            case 'image':
                return renderImageBlock(block);
            case 'button':
                return renderButtonBlock(block);
            case 'divider':
                return renderDividerBlock(block);
            case 'spacer':
                return renderSpacerBlock(block);
            default:
                return '';
        }
    };

    const renderTextBlock = (block: EmailBlock): string => {
        const { text, align, color, fontSize, lineHeight, padding } = block.props;
        return `
      <tr>
        <td align="${align}" style="padding: ${padding}; font-family: ${fontFamily}; color: ${color}; font-size: ${fontSize}; line-height: ${lineHeight};">
          ${text}
        </td>
      </tr>
    `;
    };

    const renderImageBlock = (block: EmailBlock): string => {
        const { src, alt, width, align, padding } = block.props;
        return `
      <tr>
        <td align="${align}" style="padding: ${padding};">
          <img src="${src}" alt="${alt}" width="${width.replace('%', '')}" style="max-width: 100%; height: auto; display: block;" border="0" />
        </td>
      </tr>
    `;
    };

    const renderButtonBlock = (block: EmailBlock): string => {
        const { text, url, backgroundColor, color, borderRadius, padding, align, width } = block.props;
        return `
      <tr>
        <td align="${align}" style="padding: 10px;">
          <table border="0" cellspacing="0" cellpadding="0" width="${width === 'full' ? '100%' : 'auto'}">
            <tr>
              <td align="center" bgcolor="${backgroundColor}" style="border-radius: ${borderRadius};">
                <a href="${url}" target="_blank" style="padding: ${padding}; border: 1px solid ${backgroundColor}; border-radius: ${borderRadius}; font-family: ${fontFamily}; font-size: 16px; color: ${color}; text-decoration: none; display: inline-block; font-weight: bold;">
                  ${text}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
    };

    const renderDividerBlock = (block: EmailBlock): string => {
        const { color, height, padding } = block.props;
        return `
      <tr>
        <td style="padding: ${padding};">
          <table border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td height="${height}" style="background-color: ${color}; height: ${height}; line-height: ${height}; font-size: 0;">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>
    `;
    };

    const renderSpacerBlock = (block: EmailBlock): string => {
        const { height } = block.props;
        return `
      <tr>
        <td height="${height}" style="height: ${height}; line-height: ${height}; font-size: 0;">&nbsp;</td>
      </tr>
    `;
    };

    const blocksHtml = children.map(renderBlock).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${backgroundColor}; font-family: ${fontFamily};">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${backgroundColor};">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; margin: 0 auto;">
          ${blocksHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
