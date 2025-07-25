import MatrixTable from '../../../../components/MatrixTable';
import { invMixColumns, generateInvMixMatrix } from '../../../../shared/aes/invMixColumns';
import { AnimatePresence, motion } from 'framer-motion';

const Step6InvMixColumns = ({ inputMatrix }) => {
  const invMixMatrix = generateInvMixMatrix();
  const invMixMatrixHex = invMixMatrix.map(row => row.map(n => n.toString(16).padStart(2, '0')));
  const outputMatrix = invMixColumns(inputMatrix, invMixMatrix);

  return (
      <div className='aes-container'>
          <AnimatePresence mode="wait">
              <motion.div
                  key="step6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="step-row-grid">
                  {/* Input matrix */}
                  <div className="step-box">
                      <h4 className="title">Input to InvMixColumns</h4>
                      <MatrixTable matrix={inputMatrix} />
                  </div>
                  {/* Output matrix */}
                  <div className="step-box">
                      <h4 className="step5-title">Output after InvMixColumns</h4>
                      <MatrixTable matrix={outputMatrix} />
                  </div>
              </motion.div>
              <motion.div key="step6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }} className="step-box">
                  {/* Visual explanation diagram */}

                  <h4 className="title">InvMixColumns Operation </h4>
                  <div className="step5-diagram-grid">
                      <div>
                          <MatrixTable matrix={inputMatrix} />
                      </div>

                      <div className="step5-diagram-symbol"> × </div>
                      <div>
                        <MatrixTable matrix={invMixMatrixHex} />
                      </div>

                      <div className="step5-diagram-symbol">=</div>
                      <div>
                          <MatrixTable matrix={outputMatrix} />
                      </div>

                  </div>
                  <div className="explanation-box">
                    The input matrix is multiplied by a fixed matrix using special byte-wise math. This mixes the column values to make the output more secure.
                  </div>
              </motion.div>
          </AnimatePresence>
      </div >
  );
};

export default Step6InvMixColumns;
