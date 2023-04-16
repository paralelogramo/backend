export const amino_next_amino = `SELECT protein_id,
                                amino1_id     AS amino<<amino 1 id>>_id,
                                amino1_symbol AS amino<<amino 1 id>>_symbol,
                                amino1_number AS amino<<amino 1 id>>_number,
                                amino2_id     AS amino<<amino 2 id>>_id,
                                amino2_symbol AS amino<<amino 2 id>>_symbol,
                                amino2_number AS amino<<amino 2 id>>_number
                                FROM  <<table>>
                                WHERE <<condition 1>>
                                AND   <<condition 2>>`;

export const amino_next_amino_any = `SELECT protein_id,
                                amino1_id     AS amino<<amino id>>_id,
                                amino1_symbol AS amino<<amino id>>_symbol,
                                amino1_number AS amino<<amino id>>_number,
                                amino2_id     AS amino<<amino_any id>>_id,
                                amino2_symbol AS amino<<amino_any id>>_symbol,
                                amino2_number AS amino<<amino_any id>>_number
                                FROM  <<table>>
                                WHERE  <<condition>>`;

export const amino_any_next_amino = `SELECT protein_id,
                                amino1_id     AS amino<<amino_any id>>_id,
                                amino1_symbol AS amino<<amino_any id>>_symbol,
                                amino1_number AS amino<<amino_any id>>_number,
                                amino2_id     AS amino<<amino id>>_id,
                                amino2_symbol AS amino<<amino id>>_symbol,
                                amino2_number AS amino<<amino id>>_number
                                FROM  <<table>>
                                WHERE  <<condition>>`;

export const amino_any_next_amino_any = `SELECT protein_id,
                                amino1_id     AS amino<<amino_any 1 id>>_id,
                                amino1_symbol AS amino<<amino_any 1 id>>_symbol,
                                amino1_number AS amino<<amino_any 1 id>>_number,
                                amino2_id     AS amino<<amino_any 2 id>>_id,
                                amino2_symbol AS amino<<amino_any 2 id>>_symbol,
                                amino2_number AS amino<<amino_any 2 id>>_number
                                FROM  <<table>>
                                `;
                                
export const amino_gap_amino = `SELECT *,
                                <<diffs_select>>
                                FROM (
                                    SELECT * FROM (
                                        <<big_query>>
                                    ) AS gapquery
                                    WHERE  <<diffs_where>>
                                ) AS gap_range_query
                                WHERE (
                                    <<diffs_min_max>>
                                )`;


export const ligand_amino = '';

export default function getQuery(littleQueries) {
    var index = 1;
    if (littleQueries.length > 1){
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
    
        for (let i = 0; i <= littleQueries.length; i++) {
            init = init + `amino` + (i+1).toString() + `_id <> amino` + (i+2).toString() + `_id    AND\n`
        }
    
        var finalQuery = init.slice(0, init.length-4)
        return finalQuery;
    }
    if (littleQueries.length == 1){
        return littleQueries[0];
    }
    
}
  