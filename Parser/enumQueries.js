export const amino_next_amino = `SELECT protein_id,
                                amino1_id     AS amino<<amino 1 id>>_id,
                                amino1_symbol AS amino<<amino 1 id>>_symbol,
                                amino1_number AS amino<<amino 1 id>>_number,
                                amino2_id     AS amino<<amino 2 id>>_id,
                                amino2_symbol AS amino<<amino 2 id>>_symbol,
                                amino2_number AS amino<<amino 2 id>>_number
                                FROM  <<table>>
                                WHERE <<condition 1>>
                                AND   <<condition 2>>
                                <<gap condition>>`;

export const amino_next_amino_any = `SELECT protein_id,
                                amino1_id     AS amino<<amino id>>_id,
                                amino1_symbol AS amino<<amino id>>_symbol,
                                amino1_number AS amino<<amino id>>_number,
                                amino2_id     AS amino<<amino_any id>>_id,
                                amino2_symbol AS amino<<amino_any id>>_symbol,
                                amino2_number AS amino<<amino_any id>>_number
                                FROM  <<table>>
                                WHERE  <<condition>>
                                <<gap condition>>`;

export const amino_any_next_amino = `SELECT protein_id,
                                amino1_id     AS amino<<amino_any id>>_id,
                                amino1_symbol AS amino<<amino_any id>>_symbol,
                                amino1_number AS amino<<amino_any id>>_number,
                                amino2_id     AS amino<<amino id>>_id,
                                amino2_symbol AS amino<<amino id>>_symbol,
                                amino2_number AS amino<<amino id>>_number
                                FROM  <<table>>
                                WHERE  <<condition>>
                                <<gap condition>>`;

export const amino_any_next_amino_any = `SELECT protein_id,
                                amino1_id     AS amino<<amino_any 1 id>>_id,
                                amino1_symbol AS amino<<amino_any 1 id>>_symbol,
                                amino1_number AS amino<<amino_any 1 id>>_number,
                                amino2_id     AS amino<<amino_any 2 id>>_id,
                                amino2_symbol AS amino<<amino_any 2 id>>_symbol,
                                amino2_number AS amino<<amino_any 2 id>>_number
                                FROM  <<table>>
                                <<gap condition>>`;

export const amino_gap_condition = `AND ((Split_part(amino2_id, '_', 3)::INT) > (Split_part(amino1_id, '_', 3)::INT))
                              AND ((((Split_part(amino2_id, '_', 3)::INT) - (Split_part(amino1_id, '_', 3)::INT)) ::INT)::INT - 1 >= <<min_gap>>)
                              AND ((((Split_part(amino2_id, '_', 3)::INT) - (Split_part(amino1_id, '_', 3)::INT)) ::INT)::INT - 1 <= <<max_gap>>)`;

export const ligand_to_amino = `SELECT protein_id, het_id, het_number, het_symbol,
                                amino_id AS amino<<amino id>>_id,
                                amino_symbol AS amino<<amino id>>_symbol,
                                amino_number AS amino<<amino id>>_number
                                FROM distance_het_amino
                                WHERE (<<ligand condition>>)
                                AND (<<amino condition>>)`;

export const ligand_to_any_amino = `SELECT protein_id, het_id, het_number, het_symbol,
                                    amino_id AS amino<<amino id>>_id,
                                    amino_symbol AS amino<<amino id>>_symbol,
                                    amino_number AS amino<<amino id>>_number
                                    FROM distance_het_amino
                                    WHERE (<<ligand condition>>)`;

export const any_ligand_to_amino = `SELECT protein_id, het_id, het_number, het_symbol,
                                    amino_id AS amino<<amino id>>_id,
                                    amino_symbol AS amino<<amino id>>_symbol,
                                    amino_number AS amino<<amino id>>_number
                                    FROM distance_het_amino
                                    WHERE <<amino condition>>`;

export const any_ligand_to_any_amino = `SELECT protein_id, het_id, het_number, het_symbol,
                                        amino_id AS amino<<amino id>>_id,
                                        amino_symbol AS amino<<amino id>>_symbol,
                                        amino_number AS amino<<amino id>>_number
                                        FROM distance_het_amino`;
                                    
export const list_of_aminos_start_end = `SELECT string_agg(amino1_symbol, '-') AS pattern
                                        FROM (
                                            SELECT amino1_symbol
                                            FROM next_amino_amino
                                            WHERE
                                                protein_id = '<<p_id>>' AND
                                                Split_part(amino1_id, '_', 3)::INT >= <<start>> AND
                                                Split_part(amino1_id, '_', 3)::INT <= <<end>>
                                            ORDER BY amino1_id ASC
                                        ) AS Q `

export default function getQuery(littleQueries, lastIndex) {
    var index = 1;
    if (lastIndex > 1){
        var lastQuery = littleQueries.pop();
        var init = ` SELECT *
        FROM (
            (
        `;
        var end = `
        )
        WHERE
        `;
    
        littleQueries.forEach(query => {
            init = init + query + ` )
            AS
            Q` + index + ` NATURAL JOIN
                (
            `;
            index = index + 1;
        });
    
        init = init + lastQuery + ` )
        AS
        Q` + index + end;
    
        for (let i = 1; i < lastIndex; i++) {
            init = init + `amino` + (i).toString() + `_id <> amino` + (i+1).toString() + `_id    AND\n`
        }
    
        var finalQuery = init.slice(0, init.length-4)
        return finalQuery;
    }
    if (lastIndex == 1){
        return littleQueries[0];
    }
    
}
  