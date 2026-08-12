import { DocumentAst, AstBlock } from '../types/extraction';

export interface AstStats {
  totalBlocks: number;
  headingsCount: number;
  paragraphsCount: number;
  listsCount: number;
  tablesCount: number;
  codesCount: number;
  imagesCount: number;
}

/**
 * Calculate count statistics for each AST block type
 */
export function calculateAstStats(ast: DocumentAst): AstStats {
  const stats: AstStats = {
    totalBlocks: ast.blocks.length,
    headingsCount: 0,
    paragraphsCount: 0,
    listsCount: 0,
    tablesCount: 0,
    codesCount: 0,
    imagesCount: ast.images?.length || 0,
  };

  ast.blocks.forEach((block: AstBlock) => {
    switch (block.block_type) {
      case 'heading':
        stats.headingsCount++;
        break;
      case 'paragraph':
        stats.paragraphsCount++;
        break;
      case 'list':
        stats.listsCount++;
        break;
      case 'table':
        stats.tablesCount++;
        break;
      case 'code':
        stats.codesCount++;
        break;
      case 'image':
        // If images block type exists in blocks list
        break;
    }
  });

  return stats;
}