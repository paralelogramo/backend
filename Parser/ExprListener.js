// Generated from Expr.g4 by ANTLR 4.12.0
// jshint ignore: start
import antlr4 from 'antlr4';
import getQuery from './enumQueries.js';
import {
	amino_any_next_amino,
	amino_any_next_amino_any,
	amino_next_amino,
	amino_next_amino_any,
	amino_gap_condition
} from './enumQueries.js';
import { setBigQuery } from './catchElements.js';

// This class defines a complete listener for a parse tree produced by ExprParser.
export default class ExprListener extends antlr4.tree.ParseTreeListener {

	lastAmino = "";
	index = 0;
	queries = [];
	repetitions = [];

	// auxiliary for gaps
	isGap = false;
	table = "next_amino_amino";
	minGap = 0;
	maxGap = 0;

	// Enter a parse tree produced by ExprParser#pattern.
	enterPattern(ctx) {
	}

	// Exit a parse tree produced by ExprParser#pattern.
	exitPattern(ctx) {
		var bigQuery = getQuery(this.queries);
		var completeQuery = `
		SELECT id, title, classification, organism, Q.* FROM (
			`+ bigQuery + `) AS Q NATURAL JOIN protein WHERE protein_id=id`;
		setBigQuery(completeQuery);
	}


	// Enter a parse tree produced by ExprParser#ligandclause.
	enterLigandclause(ctx) {
	}

	// Exit a parse tree produced by ExprParser#ligandclause.
	exitLigandclause(ctx) {
	}


	// Enter a parse tree produced by ExprParser#ligandextended.
	enterLigandextended(ctx) {
	}

	// Exit a parse tree produced by ExprParser#ligandextended.
	exitLigandextended(ctx) {
	}


	// Enter a parse tree produced by ExprParser#ligand.
	enterLigand(ctx) {
	}

	// Exit a parse tree produced by ExprParser#ligand.
	exitLigand(ctx) {
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
			if (this.lastAmino.toUpperCase() == 'X') {

				// Check if the current amino is a Any amino
				if (ctx.getText().toUpperCase() == 'X') {
					var query = amino_any_next_amino_any;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino_any 1 id>>', (this.index).toString());
					query = query.replaceAll("<<amino_any 2 id>>", (this.index + 1).toString());
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a except
				else if (ctx.getText().includes('{') && ctx.getText().includes('}')) {
					var query = amino_any_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino_any id>>', (this.index).toString());
					query = query.replaceAll('<<amino id>>', (this.index + 1).toString());


					// remove the curly brackets and iterate over the amino acids
					var aminoAcids = ctx.getText().replace('{', '').replace('}', '').split('');
					var first = aminoAcids.shift();
					var condition = "(amino2_symbol !='" + first + "' ";
					aminoAcids.forEach(amino => {
						condition += "AND amino2_symbol !='" + amino + "' ";
					});
					condition += ")";
					query = query.replaceAll('<<condition>>', condition);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a group
				else if (ctx.getText().includes('[') && ctx.getText().includes(']')) {
					var query = amino_any_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino_any id>>', (this.index).toString());
					query = query.replaceAll('<<amino id>>', (this.index + 1).toString());


					// remove the square brackets and iterate over the amino acids
					var aminoAcids = ctx.getText().replace('[', '').replace(']', '').split('');
					var first = aminoAcids.shift();
					var condition = "(amino2_symbol ='" + first + "' ";
					aminoAcids.forEach(amino => {
						condition += "OR amino2_symbol ='" + amino + "' ";
					});
					condition += ")";
					query = query.replaceAll('<<condition>>', condition);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a unique amino
				else {
					var query = amino_any_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino_any id>>', (this.index).toString());
					query = query.replaceAll('<<amino id>>', (this.index + 1).toString());

					query = query.replaceAll('<<condition>>', "amino2_symbol ='" + ctx.getText() + "'");
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}
			}

			// Check if the last amino is a except
			else if (this.lastAmino.includes('{') && this.lastAmino.includes('}')) {
				// Check if the current amino is a Any amino
				if (ctx.getText().toUpperCase() == 'X') {
					var query = amino_next_amino_any;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino id>>', (this.index).toString());
					query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString());


					// remove the curly brackets and iterate over the amino acids
					var aminoAcids = this.lastAmino.replace('{', '').replace('}', '').split('');
					var first = aminoAcids.shift();
					var condition = "(amino1_symbol !='" + first + "' ";
					aminoAcids.forEach(amino => {
						condition += "AND amino1_symbol !='" + amino + "' ";
					});
					condition += ")";
					query = query.replaceAll('<<condition>>', condition);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a except
				else if (ctx.getText().includes('{') && ctx.getText().includes('}')) {
					var query = amino_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());


					// remove the curly brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol !='" + first1 + "' ";
					aminoAcids1.forEach(amino => {
						condition1 += "AND amino1_symbol !='" + amino + "' ";
					});
					condition1 += ")";
					var aminoAcids2 = ctx.getText().replace('{', '').replace('}', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol !='" + first2 + "' ";
					aminoAcids2.forEach(amino => {
						condition2 += "AND amino2_symbol !='" + amino + "' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', condition2);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a group
				else if (ctx.getText().includes('[') && ctx.getText().includes(']')) {
					var query = amino_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());


					// remove the curly brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol !='" + first1 + "' ";
					aminoAcids1.forEach(amino => {
						condition1 += "AND amino1_symbol !='" + amino + "' ";
					});
					condition1 += ")";
					var aminoAcids2 = ctx.getText().replace('[', '').replace(']', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol ='" + first2 + "' ";
					aminoAcids2.forEach(amino => {
						condition2 += "OR amino2_symbol ='" + amino + "' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', condition2);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a unique amino
				else {
					var query = amino_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());


					// remove the curly brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol !='" + first1 + "' ";
					aminoAcids1.forEach(amino => {
						condition1 += "AND amino1_symbol !='" + amino + "' ";
					});
					condition1 += ")";

					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', "amino2_symbol ='" + ctx.getText() + "'")
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}
			}

			// Check if the last amino is a group
			else if (this.lastAmino.includes('[') && this.lastAmino.includes(']')) {
				// Check if the current amino is a Any amino
				if (ctx.getText().toUpperCase() == 'X') {
					var query = amino_next_amino_any;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino id>>', (this.index).toString());
					query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString());


					// remove the square brackets and iterate over the amino acids
					var aminoAcids = this.lastAmino.replace('[', '').replace(']', '').split('');
					var first = aminoAcids.shift();
					var condition = "(amino1_symbol ='" + first + "' ";
					aminoAcids.forEach(amino => {
						condition += "OR amino1_symbol ='" + amino + "' ";
					});
					condition += ")";
					query = query.replaceAll('<<condition>>', condition);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a except
				else if (ctx.getText().includes('{') && ctx.getText().includes('}')) {
					var query = amino_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());


					// remove the curly and square brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol ='" + first1 + "' ";
					aminoAcids1.forEach(amino => {
						condition1 += "OR amino1_symbol ='" + amino + "' ";
					});
					condition1 += ")";
					var aminoAcids2 = ctx.getText().replace('{', '').replace('}', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol !='" + first2 + "' ";
					aminoAcids2.forEach(amino => {
						condition2 += "AND amino2_symbol !='" + amino + "' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', condition2);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a group
				else if (ctx.getText().includes('[') && ctx.getText().includes(']')) {
					var query = amino_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());


					// remove the square brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol ='" + first1 + "' ";
					aminoAcids1.forEach(amino => {
						condition1 += "OR amino1_symbol ='" + amino + "' ";
					});
					condition1 += ")";
					var aminoAcids2 = ctx.getText().replace('[', '').replace(']', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol ='" + first2 + "' ";
					aminoAcids2.forEach(amino => {
						condition2 += "OR amino2_symbol ='" + amino + "' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', condition2);
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a unique amino
				else {
					var query = amino_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());


					// remove the square brackets and iterate over the amino acids
					var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
					var first1 = aminoAcids1.shift();
					var condition1 = "(amino1_symbol ='" + first1 + "' ";
					aminoAcids1.forEach(amino => {
						condition1 += "OR amino1_symbol ='" + amino + "' ";
					});
					condition1 += ")";

					query = query.replaceAll('<<condition 1>>', condition1);
					query = query.replaceAll('<<condition 2>>', "amino2_symbol ='" + ctx.getText() + "'")
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}
			}

			// Check if the last amino is a unique amino
			else {
				// Check if the current amino is a Any amino
				if (ctx.getText().toUpperCase() == 'X') {
					var query = amino_next_amino_any;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino id>>', (this.index).toString())
					query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString())

					query = query.replaceAll('<<condition>>', "amino1_symbol ='" + this.lastAmino + "'")
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a except
				else if (ctx.getText().includes('{') && ctx.getText().includes('}')) {
					var query = amino_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())


					// remove the curly brackets and iterate over the amino acids
					var aminoAcids2 = ctx.getText().replace('{', '').replace('}', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol !='" + first2 + "' ";
					aminoAcids2.forEach(amino => {
						condition2 += "AND amino2_symbol !='" + amino + "' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', "amino1_symbol ='" + this.lastAmino + "'")
					query = query.replaceAll('<<condition 2>>', condition2)
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a group
				else if (ctx.getText().includes('[') && ctx.getText().includes(']')) {
					var query = amino_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())


					// remove the curly brackets and iterate over the amino acids
					var aminoAcids2 = ctx.getText().replace('[', '').replace(']', '').split('');
					var first2 = aminoAcids2.shift();
					var condition2 = "(amino2_symbol ='" + first2 + "' ";
					aminoAcids2.forEach(amino => {
						condition2 += "OR amino2_symbol ='" + amino + "' ";
					});
					condition2 += ")";
					query = query.replaceAll('<<condition 1>>', "amino1_symbol ='" + this.lastAmino + "'")
					query = query.replaceAll('<<condition 2>>', condition2)
					this.queries.push(query)
					this.lastAmino = ctx.getText()
					this.index += 1;
				}

				// Check if the current amino is a unique amino
				else {
					var query = amino_next_amino;

					if (this.isGap) {
						this.table = "distance_amino_amino";
						var gap_condition = amino_gap_condition;
						gap_condition = gap_condition.replaceAll("<<min_gap>>", this.minGap);
						gap_condition = gap_condition.replaceAll("<<max_gap>>", this.maxGap);

						query = query.replaceAll("<<table>>", 'distance_amino_amino');
						query = query.replaceAll("<<gap condition>>", gap_condition);
						this.isGap = false;
						this.minGap = 0;
						this.maxGap = 0;
					}
					else {
						query = query.replaceAll("<<table>>", 'next_amino_amino');
						query = query.replaceAll("<<gap condition>>", '');
					}

					query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
					query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())

					query = query.replaceAll('<<condition 1>>', "amino1_symbol ='" + this.lastAmino + "'")
					query = query.replaceAll('<<condition 2>>', "amino2_symbol ='" + ctx.getText() + "'")
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
				if (this.lastAmino.toUpperCase() == 'X') {

					// Check if the current amino is a Any amino
					if (amino.toUpperCase() == 'X') {
						var query = amino_any_next_amino_any;
						query = query.replaceAll('<<amino_any 1 id>>', (this.index).toString())
						query = query.replaceAll("<<amino_any 2 id>>", (this.index + 1).toString())
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a except
					else if (amino.includes('{') && amino.includes('}')) {
						var query = amino_any_next_amino;
						query = query.replaceAll('<<amino_any id>>', (this.index).toString());
						query = query.replaceAll('<<amino id>>', (this.index + 1).toString());

						// remove the curly brackets and iterate over the amino acids
						var aminoAcids = amino.replace('{', '').replace('}', '').split('');
						var first = aminoAcids.shift();
						var condition = "(amino2_symbol !='" + first + "' ";
						aminoAcids.forEach(amino => {
							condition += "AND amino2_symbol !='" + amino + "' ";
						});
						condition += ")";
						query = query.replaceAll('<<condition>>', condition);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a group
					else if (amino.includes('[') && amino.includes(']')) {
						var query = amino_any_next_amino;
						query = query.replaceAll('<<amino_any id>>', (this.index).toString());
						query = query.replaceAll('<<amino id>>', (this.index + 1).toString());

						// remove the square brackets and iterate over the amino acids
						var aminoAcids = amino.replace('[', '').replace(']', '').split('');
						var first = aminoAcids.shift();
						var condition = "(amino2_symbol ='" + first + "' ";
						aminoAcids.forEach(amino => {
							condition += "OR amino2_symbol ='" + amino + "' ";
						});
						condition += ")";
						query = query.replaceAll('<<condition>>', condition);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a unique amino
					else {
						var query = amino_any_next_amino;
						query = query.replaceAll('<<amino_any id>>', (this.index).toString());
						query = query.replaceAll('<<amino id>>', (this.index + 1).toString());
						query = query.replaceAll('<<condition>>', "amino2_symbol ='" + amino + "'");
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
				}

				// Check if the last amino is a except
				else if (this.lastAmino.includes('{') && this.lastAmino.includes('}')) {
					// Check if the current amino is a Any amino
					if (amino.toUpperCase() == 'X') {
						var query = amino_next_amino_any;
						query = query.replaceAll('<<amino id>>', (this.index).toString());
						query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString());

						// remove the curly brackets and iterate over the amino acids
						var aminoAcids = this.lastAmino.replace('{', '').replace('}', '').split('');
						var first = aminoAcids.shift();
						var condition = "(amino1_symbol !='" + first + "' ";
						aminoAcids.forEach(amino => {
							condition += "AND amino1_symbol !='" + amino + "' ";
						});
						condition += ")";
						query = query.replaceAll('<<condition>>', condition);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a except
					else if (amino.includes('{') && amino.includes('}')) {
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

						// remove the curly brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol !='" + first1 + "' ";
						aminoAcids1.forEach(amino => {
							condition1 += "AND amino1_symbol !='" + amino + "' ";
						});
						condition1 += ")";
						var aminoAcids2 = amino.replace('{', '').replace('}', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol !='" + first2 + "' ";
						aminoAcids2.forEach(amino => {
							condition2 += "AND amino2_symbol !='" + amino + "' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', condition2);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a group
					else if (amino.includes('[') && amino.includes(']')) {
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

						// remove the curly brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol !='" + first1 + "' ";
						aminoAcids1.forEach(amino => {
							condition1 += "AND amino1_symbol !='" + amino + "' ";
						});
						condition1 += ")";
						var aminoAcids2 = amino.replace('[', '').replace(']', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol ='" + first2 + "' ";
						aminoAcids2.forEach(amino => {
							condition2 += "OR amino2_symbol ='" + amino + "' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', condition2);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a unique amino
					else {
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

						// remove the curly brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('{', '').replace('}', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol !='" + first1 + "' ";
						aminoAcids1.forEach(amino => {
							condition1 += "AND amino1_symbol !='" + amino + "' ";
						});
						condition1 += ")";

						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', "amino2_symbol ='" + amino + "'")
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
				}

				// Check if the last amino is a group
				else if (this.lastAmino.includes('[') && this.lastAmino.includes(']')) {
					// Check if the current amino is a Any amino
					if (amino.toUpperCase() == 'X') {
						var query = amino_next_amino_any;
						query = query.replaceAll('<<amino id>>', (this.index).toString());
						query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString());

						// remove the square brackets and iterate over the amino acids
						var aminoAcids = this.lastAmino.replace('[', '').replace(']', '').split('');
						var first = aminoAcids.shift();
						var condition = "(amino1_symbol ='" + first + "' ";
						aminoAcids.forEach(amino => {
							condition += "OR amino1_symbol ='" + amino + "' ";
						});
						condition += ")";
						query = query.replaceAll('<<condition>>', condition);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a except
					else if (amino.includes('{') && amino.includes('}')) {
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

						// remove the curly and square brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol ='" + first1 + "' ";
						aminoAcids1.forEach(amino => {
							condition1 += "OR amino1_symbol ='" + amino + "' ";
						});
						condition1 += ")";
						var aminoAcids2 = amino.replace('{', '').replace('}', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol !='" + first2 + "' ";
						aminoAcids2.forEach(amino => {
							condition2 += "AND amino2_symbol !='" + amino + "' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', condition2);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a group
					else if (amino.includes('[') && amino.includes(']')) {
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

						// remove the square brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol ='" + first1 + "' ";
						aminoAcids1.forEach(amino => {
							condition1 += "OR amino1_symbol ='" + amino + "' ";
						});
						condition1 += ")";
						var aminoAcids2 = amino.replace('[', '').replace(']', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol ='" + first2 + "' ";
						aminoAcids2.forEach(amino => {
							condition2 += "OR amino2_symbol ='" + amino + "' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', condition2);
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a unique amino
					else {
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString());
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString());

						// remove the square brackets and iterate over the amino acids
						var aminoAcids1 = this.lastAmino.replace('[', '').replace(']', '').split('');
						var first1 = aminoAcids1.shift();
						var condition1 = "(amino1_symbol ='" + first1 + "' ";
						aminoAcids1.forEach(amino => {
							condition1 += "OR amino1_symbol ='" + amino + "' ";
						});
						condition1 += ")";

						query = query.replaceAll('<<condition 1>>', condition1);
						query = query.replaceAll('<<condition 2>>', "amino2_symbol ='" + amino + "'")
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}
				}

				// Check if the last amino is a unique amino
				else {
					// Check if the current amino is a Any amino
					if (amino.toUpperCase() == 'X') {
						var query = amino_next_amino_any;
						query = query.replaceAll('<<amino id>>', (this.index).toString())
						query = query.replaceAll('<<amino_any id>>', (this.index + 1).toString())
						query = query.replaceAll('<<condition>>', "amino1_symbol ='" + this.lastAmino + "'")
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a except
					else if (amino.includes('{') && amino.includes('}')) {
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())

						// remove the curly brackets and iterate over the amino acids
						var aminoAcids2 = amino.replace('{', '').replace('}', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol !='" + first2 + "' ";
						aminoAcids2.forEach(amino => {
							condition2 += "AND amino2_symbol !='" + amino + "' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', "amino1_symbol ='" + this.lastAmino + "'")
						query = query.replaceAll('<<condition 2>>', condition2)
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a group
					else if (amino.includes('[') && amino.includes(']')) {
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())

						// remove the curly brackets and iterate over the amino acids
						var aminoAcids2 = amino.replace('[', '').replace(']', '').split('');
						var first2 = aminoAcids2.shift();
						var condition2 = "(amino2_symbol ='" + first2 + "' ";
						aminoAcids2.forEach(amino => {
							condition2 += "OR amino2_symbol ='" + amino + "' ";
						});
						condition2 += ")";
						query = query.replaceAll('<<condition 1>>', "amino1_symbol ='" + this.lastAmino + "'")
						query = query.replaceAll('<<condition 2>>', condition2)
						this.queries.push(query)
						this.lastAmino = amino
						this.index += 1;
					}

					// Check if the current amino is a unique amino
					else {
						var query = amino_next_amino;
						query = query.replaceAll('<<amino 1 id>>', (this.index).toString())
						query = query.replaceAll('<<amino 2 id>>', (this.index + 1).toString())
						query = query.replaceAll('<<condition 1>>', "amino1_symbol ='" + this.lastAmino + "'")
						query = query.replaceAll('<<condition 2>>', "amino2_symbol ='" + amino + "'")
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
		var gap = ctx.getText();
		var minmax = gap.split('(')[1].replaceAll(')', '').split(',');
		var min = minmax[0];
		var max = minmax[1];
		this.isGap = true;
		this.minGap = min;
		this.maxGap = max;
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


	// Enter a parse tree produced by ExprParser#character.
	enterCharacter(ctx) {
	}

	// Exit a parse tree produced by ExprParser#character.
	exitCharacter(ctx) {
	}



}