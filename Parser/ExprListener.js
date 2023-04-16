// Generated from java-escape by ANTLR 4.11.1
// jshint ignore: start
import antlr4 from 'antlr4';
import getQuery from './enumQueries.js';
import { amino_any_next_amino,
		 amino_any_next_amino_any,
		 amino_next_amino,
		 amino_next_amino_any,
		 amino_gap_amino, diff_select, diff_where, diff_min_max
		} from './enumQueries.js';
import { setBigQuery } from './catchElements.js';


class repExt {
	constructor(last, next, min, max) {
		this.last = last;
		this.next = next;
		this.min = min;
		this.max = max;
	}
}

// This class defines a complete listener for a parse tree produced by ExprParser.
export default class ExprListener extends antlr4.tree.ParseTreeListener {
	lastAmino = "";
	index = 0;
	queries = [];
	repetitions = [];

	// Enter a parse tree produced by ExprParser#pattern.
	enterPattern(ctx) {
	}

	// Exit a parse tree produced by ExprParser#pattern.
	exitPattern(ctx) {
		var bigQuery = getQuery(this.queries);
		var completeQuery = `
		SELECT id, title, classification, organism, Q.* FROM (
			`+ bigQuery + `) AS Q NATURAL JOIN protein WHERE protein_id=id`;

		// Check repetitions
		this.repetitions.forEach(rep => {
			var query = amino_gap_amino;
			query = query.replaceAll('<<amino1_id>>', rep.last);
			query = query.replaceAll('<<amino2_id>>', rep.next);
			query = query.replaceAll('<<gap_min>>', rep.min);
			query = query.replaceAll('<<gap_max>>', rep.max);
			var diffs_select = "";
			var diffs_where = "";
			var diffs_min_max = "";
			for (let i = 1; i < this.index; i++) {
				diffs_select = diffs_select + diff_select.replaceAll('<<amino1_id>>', i.toString()).replaceAll('<<amino2_id>>', (i+1).toString());
				diffs_where = diffs_where + diff_where.replaceAll('<<amino1_id>>', i.toString()).replaceAll('<<amino2_id>>', (i+1).toString()) + " AND ";
				diffs_min_max = diffs_min_max + diff_min_max.replaceAll('<<amino1_id>>', i.toString()).replaceAll('<<amino2_id>>', (i+1).toString()) + " AND ";
			}
			diffs_select = diffs_select.slice(0, diffs_select.length-1);
			diffs_where = diffs_where.slice(0, diffs_where.length-5);
			diffs_min_max = diffs_min_max.slice(0, diffs_min_max.length-5);
			query = query.replaceAll('<<diffs_select>>', diffs_select);
			query = query.replaceAll('<<diffs_where>>', diffs_where);
			query = query.replaceAll('<<diffs_min_max>>', diffs_min_max);
			completeQuery = completeQuery + " AND " + query;
		});

		console.log(completeQuery)
		setBigQuery(completeQuery);
	}


	// Enter a parse tree produced by ExprParser#aminoexpression.
	enterAminoexpression(ctx) {
	}

	// Exit a parse tree produced by ExprParser#aminoexpression.
	exitAminoexpression(ctx) {
	}


	// Enter a parse tree produced by ExprParser#aminoclause.
	enterAminoclause(ctx) {
	}

	// Exit a parse tree produced by ExprParser#aminoclause.
	exitAminoclause(ctx) {
		// First check the type of amino acid: can be unique or group or except.
		if (this.lastAmino == "") {
			this.lastAmino = ctx.getText()
			this.index += 1;
		}
		else {
			// Check if the last amino is a Any amino
			if(this.lastAmino.toUpperCase() == 'X'){

				// Check if the current amino is a Any amino
				if(ctx.getText().toUpperCase() == 'X'){
					var query = amino_any_next_amino_any;
					query = query.replaceAll('<<amino_any 1 id>>', (this.index).toString())
					query = query.replaceAll("<<amino_any 2 id>>", (this.index + 1).toString())
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a except
				else if(ctx.getText().includes('{') && ctx.getText().includes('}')){
					var query = amino_any_next_amino;
					query = query.replaceAll('<<amino_any id>>', (this.index).toString());
					query = query.replaceAll('<<amino id>>', (this.index + 1).toString());

					// remove the curly brackets and iterate over the amino acids
					var aminoAcids = ctx.getText().replace('{', '').replace('}', '').split('');
					var first = aminoAcids.shift();
					var condition = "(amino2_symbol !='"+first+"' ";
					aminoAcids.forEach(amino => {
						condition += "AND amino2_symbol !='"+amino+"' ";
					});
					condition += ")";
					query = query.replaceAll('<<condition>>', condition);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a group
				else if(ctx.getText().includes('[') && ctx.getText().includes(']')){
					var query = amino_any_next_amino;
					query = query.replaceAll('<<amino_any id>>', (this.index).toString());
					query = query.replaceAll('<<amino id>>', (this.index + 1).toString());

					// remove the square brackets and iterate over the amino acids
					var aminoAcids = ctx.getText().replace('[', '').replace(']', '').split('');
					var first = aminoAcids.shift();
					var condition = "(amino2_symbol ='"+first+"' ";
					aminoAcids.forEach(amino => {
						condition += "OR amino2_symbol ='"+amino+"' ";
					});
					condition += ")";
					query = query.replaceAll('<<condition>>', condition);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a unique amino
				else{
					var query = amino_any_next_amino;
					query = query.replaceAll('<<amino_any id>>', (this.index).toString());
					query = query.replaceAll('<<amino id>>', (this.index + 1).toString());
					query = query.replaceAll('<<condition>>', "amino2_symbol ='"+ctx.getText()+"'");
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}
			}

			// Check if the last amino is a except
			else if (this.lastAmino.includes('{') && this.lastAmino.includes('}')){
				// Check if the current amino is a Any amino
				if(ctx.getText().toUpperCase() == 'X'){
					var query = amino_next_amino_any;
					query = query.replaceAll('<<amino id>>', (this.index).toString());
					query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString());

					// remove the curly brackets and iterate over the amino acids
					var aminoAcids = this.lastAmino.replace('{', '').replace('}', '').split('');
					var first = aminoAcids.shift();
					var condition = "(amino1_symbol !='"+first+"' ";
					aminoAcids.forEach(amino => {
						condition += "AND amino1_symbol !='"+amino+"' ";
					});
					condition += ")";
					query = query.replaceAll('<<condition>>', condition);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a except
				else if(ctx.getText().includes('{') && ctx.getText().includes('}')){
					var query = amino_next_amino;
					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

					// remove the curly brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol !='"+first1+"' ";
					aminoAcids1.forEach(amino => {
						condition1 += "AND amino1_symbol !='"+amino+"' ";
					});
					condition1 += ")";
					var aminoAcids2 = ctx.getText().replace('{', '').replace('}', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol !='"+first2+"' ";
					aminoAcids2.forEach(amino => {
						condition2 += "AND amino2_symbol !='"+amino+"' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', condition2);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a group
				else if(ctx.getText().includes('[') && ctx.getText().includes(']')){
					var query = amino_next_amino;
					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

					// remove the curly brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol !='"+first1+"' ";
					aminoAcids1.forEach(amino => {
						condition1 += "AND amino1_symbol !='"+amino+"' ";
					});
					condition1 += ")";
					var aminoAcids2 = ctx.getText().replace('[', '').replace(']', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol ='"+first2+"' ";
					aminoAcids2.forEach(amino => {
						condition2 += "OR amino2_symbol ='"+amino+"' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', condition2);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a unique amino
				else{
					var query = amino_next_amino;
					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

					// remove the curly brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol !='"+first1+"' ";
					aminoAcids1.forEach(amino => {
						condition1 += "AND amino1_symbol !='"+amino+"' ";
					});
					condition1 += ")";
					
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', "amino2_symbol ='"+ctx.getText()+"'")
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}
			}

			// Check if the last amino is a group
			else if (this.lastAmino.includes('[') && this.lastAmino.includes(']')){
				// Check if the current amino is a Any amino
				if(ctx.getText().toUpperCase() == 'X'){
					var query = amino_next_amino_any;
					query = query.replaceAll('<<amino id>>', (this.index).toString());
					query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString());

					// remove the square brackets and iterate over the amino acids
					var aminoAcids = this.lastAmino.replace('[', '').replace(']', '').split('');
					var first = aminoAcids.shift();
					var condition = "(amino1_symbol ='"+first+"' ";
					aminoAcids.forEach(amino => {
						condition += "OR amino1_symbol ='"+amino+"' ";
					});
					condition += ")";
					query = query.replaceAll('<<condition>>', condition);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a except
				else if(ctx.getText().includes('{') && ctx.getText().includes('}')){
					var query = amino_next_amino;
					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

					// remove the curly and square brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol ='"+first1+"' ";
					aminoAcids1.forEach(amino => {
						condition1 += "OR amino1_symbol ='"+amino+"' ";
					});
					condition1 += ")";
					var aminoAcids2 = ctx.getText().replace('{', '').replace('}', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol !='"+first2+"' ";
					aminoAcids2.forEach(amino => {
						condition2 += "AND amino2_symbol !='"+amino+"' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', condition2);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a group
				else if(ctx.getText().includes('[') && ctx.getText().includes(']')){
					var query = amino_next_amino;
					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

					// remove the square brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol ='"+first1+"' ";
					aminoAcids1.forEach(amino => {
						condition1 += "OR amino1_symbol ='"+amino+"' ";
					});
					condition1 += ")";
					var aminoAcids2 = ctx.getText().replace('[', '').replace(']', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol ='"+first2+"' ";
					aminoAcids2.forEach(amino => {
						condition2 += "OR amino2_symbol ='"+amino+"' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', condition2);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a unique amino
				else{
					var query = amino_next_amino;
					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

					// remove the square brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol ='"+first1+"' ";
					aminoAcids1.forEach(amino => {
						condition1 += "OR amino1_symbol ='"+amino+"' ";
					});
					condition1 += ")";
					
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', "amino2_symbol ='"+ctx.getText()+"'")
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}
			}

			// Check if the last amino is a unique amino
			else{
				// Check if the current amino is a Any amino
				if(ctx.getText().toUpperCase() == 'X'){
					var query = amino_next_amino_any;
					query = query.replaceAll('<<amino id>>', (this.index).toString())
					query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString())
					query = query.replaceAll('<<condition>>', "amino1_symbol ='"+this.lastAmino+"'")
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a except
				else if(ctx.getText().includes('{') && ctx.getText().includes('}')){
					var query = amino_next_amino;
					query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())

					// remove the curly brackets and iterate over the amino acids
					var aminoAcids2 = ctx.getText().replace('{', '').replace('}', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol !='"+first2+"' ";
					aminoAcids2.forEach(amino => {
						condition2 += "AND amino2_symbol !='"+amino+"' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', "amino1_symbol ='"+this.lastAmino+"'")
					query = query.replaceAll('<<condition 2>>', condition2)
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a group
				else if(ctx.getText().includes('[') && ctx.getText().includes(']')){
					var query = amino_next_amino;
					query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())

					// remove the curly brackets and iterate over the amino acids
					var aminoAcids2 = ctx.getText().replace('[', '').replace(']', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol ='"+first2+"' ";
					aminoAcids2.forEach(amino => {
						condition2 += "OR amino2_symbol ='"+amino+"' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', "amino1_symbol ='"+this.lastAmino+"'")
					query = query.replaceAll('<<condition 2>>', condition2)
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a unique amino
				else{
					var query = amino_next_amino;
					query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
					query = query.replaceAll('<<amino 2 id>>', (this.index+1).toString())
					query = query.replaceAll('<<condition 1>>', "amino1_symbol ='"+this.lastAmino+"'")
					query = query.replaceAll('<<condition 2>>', "amino2_symbol ='"+ctx.getText()+"'")
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}
			}
		}
	}


	// Enter a parse tree produced by ExprParser#aminoconditionor.
	enterAminoconditionor(ctx) {
	}

	// Exit a parse tree produced by ExprParser#aminoconditionor.
	exitAminoconditionor(ctx) {
	}


	// Enter a parse tree produced by ExprParser#aminoexclude.
	enterAminoexclude(ctx) {
	}

	// Exit a parse tree produced by ExprParser#aminoexclude.
	exitAminoexclude(ctx) {
	}


	// Enter a parse tree produced by ExprParser#aminorepetition.
	enterAminorepetition(ctx) {
	}

	// Exit a parse tree produced by ExprParser#aminorepetition.
	exitAminorepetition(ctx) {
		var amino = ctx.getText().split('(')[0]
		var repetition = ctx.getText().split('(')[1].replace(')', '')
		for (let i = 0; i < repetition; i++) {
			if (this.lastAmino == "") {
				this.lastAmino = amino
				this.index += 1;
			}
			else {
				// Check if the last amino is a Any amino
				if(this.lastAmino.toUpperCase() == 'X'){
	
					// Check if the current amino is a Any amino
					if(amino.toUpperCase() == 'X'){
						var query = amino_any_next_amino_any;
						query = query.replaceAll('<<amino_any 1 id>>', (this.index).toString())
						query = query.replaceAll("<<amino_any 2 id>>", (this.index + 1).toString())
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a except
					else if(amino.includes('{') && amino.includes('}')){
						var query = amino_any_next_amino;
						query = query.replaceAll('<<amino_any id>>', (this.index).toString());
						query = query.replaceAll('<<amino id>>', (this.index + 1).toString());
	
						// remove the curly brackets and iterate over the amino acids
						var aminoAcids = amino.replace('{', '').replace('}', '').split('');
						var first = aminoAcids.shift();
						var condition = "(amino2_symbol !='"+first+"' ";
						aminoAcids.forEach(amino => {
							condition += "AND amino2_symbol !='"+amino+"' ";
						});
						condition += ")";
						query = query.replaceAll('<<condition>>', condition);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a group
					else if(amino.includes('[') && amino.includes(']')){
						var query = amino_any_next_amino;
						query = query.replaceAll('<<amino_any id>>', (this.index).toString());
						query = query.replaceAll('<<amino id>>', (this.index + 1).toString());
	
						// remove the square brackets and iterate over the amino acids
						var aminoAcids = amino.replace('[', '').replace(']', '').split('');
						var first = aminoAcids.shift();
						var condition = "(amino2_symbol ='"+first+"' ";
						aminoAcids.forEach(amino => {
							condition += "OR amino2_symbol ='"+amino+"' ";
						});
						condition += ")";
						query = query.replaceAll('<<condition>>', condition);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a unique amino
					else{
						var query = amino_any_next_amino;
						query = query.replaceAll('<<amino_any id>>', (this.index).toString());
						query = query.replaceAll('<<amino id>>', (this.index + 1).toString());
						query = query.replaceAll('<<condition>>', "amino2_symbol ='"+amino+"'");
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
				}
	
				// Check if the last amino is a except
				else if (this.lastAmino.includes('{') && this.lastAmino.includes('}')){
					// Check if the current amino is a Any amino
					if(amino.toUpperCase() == 'X'){
						var query = amino_next_amino_any;
						query = query.replaceAll('<<amino id>>', (this.index).toString());
						query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString());
	
						// remove the curly brackets and iterate over the amino acids
						var aminoAcids = this.lastAmino.replace('{', '').replace('}', '').split('');
						var first = aminoAcids.shift();
						var condition = "(amino1_symbol !='"+first+"' ";
						aminoAcids.forEach(amino => {
							condition += "AND amino1_symbol !='"+amino+"' ";
						});
						condition += ")";
						query = query.replaceAll('<<condition>>', condition);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a except
					else if(amino.includes('{') && amino.includes('}')){
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());
	
						// remove the curly brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol !='"+first1+"' ";
						aminoAcids1.forEach(amino => {
							condition1 += "AND amino1_symbol !='"+amino+"' ";
						});
						condition1 += ")";
						var aminoAcids2 = amino.replace('{', '').replace('}', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol !='"+first2+"' ";
						aminoAcids2.forEach(amino => {
							condition2 += "AND amino2_symbol !='"+amino+"' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', condition2);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a group
					else if(amino.includes('[') && amino.includes(']')){
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());
	
						// remove the curly brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol !='"+first1+"' ";
						aminoAcids1.forEach(amino => {
							condition1 += "AND amino1_symbol !='"+amino+"' ";
						});
						condition1 += ")";
						var aminoAcids2 = amino.replace('[', '').replace(']', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol ='"+first2+"' ";
						aminoAcids2.forEach(amino => {
							condition2 += "OR amino2_symbol ='"+amino+"' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', condition2);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a unique amino
					else{
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());
	
						// remove the curly brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol !='"+first1+"' ";
						aminoAcids1.forEach(amino => {
							condition1 += "AND amino1_symbol !='"+amino+"' ";
						});
						condition1 += ")";
						
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', "amino2_symbol ='"+amino+"'")
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
				}
	
				// Check if the last amino is a group
				else if (this.lastAmino.includes('[') && this.lastAmino.includes(']')){
					// Check if the current amino is a Any amino
					if(amino.toUpperCase() == 'X'){
						var query = amino_next_amino_any;
						query = query.replaceAll('<<amino id>>', (this.index).toString());
						query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString());
	
						// remove the square brackets and iterate over the amino acids
						var aminoAcids = this.lastAmino.replace('[', '').replace(']', '').split('');
						var first = aminoAcids.shift();
						var condition = "(amino1_symbol ='"+first+"' ";
						aminoAcids.forEach(amino => {
							condition += "OR amino1_symbol ='"+amino+"' ";
						});
						condition += ")";
						query = query.replaceAll('<<condition>>', condition);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a except
					else if(amino.includes('{') && amino.includes('}')){
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());
	
						// remove the curly and square brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol ='"+first1+"' ";
						aminoAcids1.forEach(amino => {
							condition1 += "OR amino1_symbol ='"+amino+"' ";
						});
						condition1 += ")";
						var aminoAcids2 = amino.replace('{', '').replace('}', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol !='"+first2+"' ";
						aminoAcids2.forEach(amino => {
							condition2 += "AND amino2_symbol !='"+amino+"' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', condition2);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a group
					else if(amino.includes('[') && amino.includes(']')){
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());
	
						// remove the square brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol ='"+first1+"' ";
						aminoAcids1.forEach(amino => {
							condition1 += "OR amino1_symbol ='"+amino+"' ";
						});
						condition1 += ")";
						var aminoAcids2 = amino.replace('[', '').replace(']', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol ='"+first2+"' ";
						aminoAcids2.forEach(amino => {
							condition2 += "OR amino2_symbol ='"+amino+"' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', condition2);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a unique amino
					else{
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());
	
						// remove the square brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol ='"+first1+"' ";
						aminoAcids1.forEach(amino => {
							condition1 += "OR amino1_symbol ='"+amino+"' ";
						});
						condition1 += ")";
						
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', "amino2_symbol ='"+amino+"'")
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
				}
	
				// Check if the last amino is a unique amino
				else{
					// Check if the current amino is a Any amino
					if(amino.toUpperCase() == 'X'){
						var query = amino_next_amino_any;
						query = query.replaceAll('<<amino id>>', (this.index).toString())
						query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString())
						query = query.replaceAll('<<condition>>', "amino1_symbol ='"+this.lastAmino+"'")
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a except
					else if(amino.includes('{') && amino.includes('}')){
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())
	
						// remove the curly brackets and iterate over the amino acids
						var aminoAcids2 = amino.replace('{', '').replace('}', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol !='"+first2+"' ";
						aminoAcids2.forEach(amino => {
							condition2 += "AND amino2_symbol !='"+amino+"' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', "amino1_symbol ='"+this.lastAmino+"'")
						query = query.replaceAll('<<condition 2>>', condition2)
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a group
					else if(amino.includes('[') && amino.includes(']')){
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())
	
						// remove the curly brackets and iterate over the amino acids
						var aminoAcids2 = amino.replace('[', '').replace(']', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol ='"+first2+"' ";
						aminoAcids2.forEach(amino => {
							condition2 += "OR amino2_symbol ='"+amino+"' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', "amino1_symbol ='"+this.lastAmino+"'")
						query = query.replaceAll('<<condition 2>>', condition2)
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
	
					// Check if the current amino is a unique amino
					else{
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
						query = query.replaceAll('<<amino 2 id>>', (this.index+1).toString())
						query = query.replaceAll('<<condition 1>>', "amino1_symbol ='"+this.lastAmino+"'")
						query = query.replaceAll('<<condition 2>>', "amino2_symbol ='"+amino+"'")
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
				}
			}
		}
	}


	// Enter a parse tree produced by ExprParser#aminorepetitionextension.
	enterAminorepetitionextension(ctx) {
	}

	// Exit a parse tree produced by ExprParser#aminorepetitionextension.
	exitAminorepetitionextension(ctx) {
		var components = ctx.getText().split('(');
		var minmax = components[1].replace(')', '').split(',');
		var rep = new repExt(this.index, this.index + 1, minmax[0], minmax[1]);
		this.repetitions.push(rep);
	}


	// Enter a parse tree produced by ExprParser#cterminusexpression.
	enterCterminusexpression(ctx) {
	}

	// Exit a parse tree produced by ExprParser#cterminusexpression.
	exitCterminusexpression(ctx) {
	}


	// Enter a parse tree produced by ExprParser#cterminusspecialclause.
	enterCterminusspecialclause(ctx) {
	}

	// Exit a parse tree produced by ExprParser#cterminusspecialclause.
	exitCterminusspecialclause(ctx) {
	}


	// Enter a parse tree produced by ExprParser#nterminus.
	enterNterminus(ctx) {
	}

	// Exit a parse tree produced by ExprParser#nterminus.
	exitNterminus(ctx) {
	}


	// Enter a parse tree produced by ExprParser#aminoacid.
	enterAminoacid(ctx) {
	}

	// Exit a parse tree produced by ExprParser#aminoacid.
	exitAminoacid(ctx) {
	}


	// Enter a parse tree produced by ExprParser#patternend.
	enterPatternend(ctx) {
	}

	// Exit a parse tree produced by ExprParser#patternend.
	exitPatternend(ctx) {
	}



}